
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AssessmentContext = createContext();

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
    const [step, setStep] = useState(1);

    // User Basic Info
    const [userInfo, setUserInfo] = useState({
        name: '',
        age: '',
        sex: ''
    });

    // Unified Data State (All users provide all data)
    // Diabetes / Metabolic Factors
    const [diabetesData, setDiabetesData] = useState({
        pregnancies: 0,
        glucose: 100,
        bp: 72,
        skinThickness: 20,
        insulin: 80,
        bmi: 25,
        pedigree: 0.5,
        familyHistory: true // Default true for demo
    });

    // Theme State
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    // Heart / Cardiovascular Factors
    const [heartData, setHeartData] = useState({
        chestPain: 'typical', // typical, atypical, non-anginal, asymptomatic
        restingBP: 120, // (This duplicates bp from diabetesData, usually we'd unify, but keeping separate for now to match Kaggle inputs)
        cholesterol: 200,
        maxHeartRate: 150,
        exerciseAngina: false,
        oldpeak: 1.0,
        slope: 'flat', // upsloping, flat, downsloping
        majorVessels: 0,
        thalassemia: 'normal' // normal, fixed, reversible
    });

    // Risk Calculation States
    const [isLoading, setIsLoading] = useState(false);
    const [diabetesRisk, setDiabetesRisk] = useState(0);
    const [heartRisk, setHeartRisk] = useState(0);
    const [overallRisk, setOverallRisk] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [debugLog, setDebugLog] = useState(null); // RAW DEBUG LOG

    // -------------------------------------------------------------------------
    // REAL ML API INTEGRATION
    // -------------------------------------------------------------------------

    const calculateRisk = async () => {
        setIsLoading(true);
        // Default fallbacks in case of error
        let dRisk = 0;
        let hRisk = 0;
        let dLevel = 'low';
        let hLevel = 'low';

        try {
            // 1. Prepare Diabetes Payload (Matches app.py input_data)
            const diabetesPayload = {
                Pregnancies: 0, // Not collected in wizard, default 0
                Glucose: parseFloat(diabetesData.glucose) || 100,
                BloodPressure: parseFloat(diabetesData.bp) || 70, // Corrected from diabetesData.bloodPressure
                SkinThickness: parseFloat(diabetesData.skinThickness) || 20,
                Insulin: parseFloat(diabetesData.insulin) || 80,
                BMI: parseFloat(diabetesData.bmi) || 25,
                DiabetesPedigreeFunction: diabetesData.familyHistory ? 0.8 : 0.2, // Logic: 0.8 if family history, 0.2 if not
                Age: parseInt(userInfo.age) || 30
            };

            // 2. Prepare Heart Payload (Matches app.py input_base)
            const heartPayload = {
                age: parseInt(userInfo.age) || 30,
                sex: userInfo.sex === 'male' ? 1 : 0,
                trestbps: parseFloat(heartData.restingBP) || 120,
                chol: parseFloat(heartData.cholesterol) || 200,
                fbs: 0, // Not currently collected, default 0
                thalach: parseFloat(heartData.maxHeartRate) || 150, // Corrected from heartData.maxHR
                exang: heartData.exerciseAngina ? 1 : 0,
                oldpeak: parseFloat(heartData.oldpeak) || 0,
                ca: heartData.majorVessels, // Using majorVessels

                // Categoricals (mapped to strings expected by backend)
                cp: heartData.chestPain === 'typical' ? '0' :
                    heartData.chestPain === 'atypical' ? '1' :
                        heartData.chestPain === 'non-anginal' ? '2' :
                            '3', // asymptomatic
                slope: heartData.slope === 'upsloping' ? '0' :
                    heartData.slope === 'flat' ? '1' :
                        '2', // downsloping
                thal: heartData.thalassemia === 'normal' ? '1' : // Backend expects 1 for normal, 2 for fixed, 3 for reversible
                    heartData.thalassemia === 'fixed' ? '2' :
                        '3', // reversible
                restecg: '0' // Not currently collected, default 0
            };

            console.log("DEBUG: Sending Diabetes Payload:", diabetesPayload);
            console.log("DEBUG: Sending Heart Payload:", heartPayload);

            // 3. Parallel API Calls
            const [dRes, hRes] = await Promise.allSettled([
                api.predictDiabetes(diabetesPayload),
                api.predictHeart(heartPayload)
            ]);

            console.log("DEBUG: API Responses:", { dRes, hRes });

            // CAPTURE DEBUG LOG
            const debugInfo = {
                status: 'completed',
                diabetes: dRes.status === 'fulfilled' ? dRes.value : dRes.reason,
                heart: hRes.status === 'fulfilled' ? hRes.value : hRes.reason
            };
            setDebugLog(JSON.stringify(debugInfo, null, 2));

            // 4. Process Diabetes Result
            if (dRes.status === 'fulfilled') {
                console.log("DEBUG: Diabetes Data:", dRes.value);
                dRisk = dRes.value.risk_score;
                dLevel = dRes.value.risk_level.toLowerCase();
                if (dRes.value.model_source) setIsVerified(true);
            } else {
                console.error("Diabetes API failed:", dRes.reason);
                // Fallback Logic (Mock) - KEEPING MOCK FOR NOW BUT LOGGING ERROR
                if (diabetesPayload.Glucose > 140) dRisk = 75;
                else dRisk = 15;
            }

            // 5. Process Heart Result
            if (hRes.status === 'fulfilled') {
                hRisk = hRes.value.risk_score;
                hLevel = hRes.value.risk_level.toLowerCase();
            } else {
                console.error("Heart API failed:", hRes.reason);
                if (heartPayload.thalach > 180) hRisk = 65;
                else hRisk = 10;
            }

        } catch (err) {
            console.error("Global Risk Calculation Error:", err);
        }

        setDiabetesRisk(dRisk);
        setHeartRisk(hRisk);

        // Simple composite
        const avgRisk = (dRisk + hRisk) / 2;
        setOverallRisk(avgRisk);

        setIsLoading(false);
        setStep(4); // Move to results
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const jumpToStep = (s) => setStep(s);

    const value = {
        step,
        nextStep,
        prevStep,
        jumpToStep,
        userInfo, setUserInfo,
        diabetesData, setDiabetesData,
        heartData, setHeartData,
        calculateRisk,
        isLoading,
        diabetesRisk,
        heartRisk,
        overallRisk,
        isVerified,
        theme,
        toggleTheme,
        debugLog
    };

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
};
