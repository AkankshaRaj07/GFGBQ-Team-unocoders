
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

    // Liver Factors (New)
    const [liverData, setLiverData] = useState({
        Total_Bilirubin: 0.8,
        Direct_Bilirubin: 0.2,
        Alkaline_Phosphotase: 100,
        Alamine_Aminotransferase: 30,
        Aspartate_Aminotransferase: 25,
        Total_Protiens: 7.0,
        Albumin: 4.0,
        Albumin_and_Globulin_Ratio: 1.0
    });
    const [skipLiver, setSkipLiver] = useState(false); // NEW: Skip logic

    // Mental Health Factors (New)
    const [mentalData, setMentalData] = useState({
        stressLevel: 5, // 0-10
        workload: 5,
        sleepQuality: 7
    });

    // Risk Calculation States
    const [isLoading, setIsLoading] = useState(false);
    const [diabetesRisk, setDiabetesRisk] = useState(0);
    const [heartRisk, setHeartRisk] = useState(0);
    const [liverRisk, setLiverRisk] = useState(0); // New
    const [mentalRisk, setMentalRisk] = useState(0); // New
    const [overallRisk, setOverallRisk] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [debugLog, setDebugLog] = useState(null);
    const [recommendations, setRecommendations] = useState(null); // New state

    // -------------------------------------------------------------------------
    // REAL ML API INTEGRATION
    // -------------------------------------------------------------------------

    const getRiskPredictions = async (dData, hData, lData, mData, uInfo) => {
        // 1. Diabetes Payload
        const diabetesPayload = {
            Pregnancies: 0,
            Glucose: parseFloat(dData.glucose) || 100,
            BloodPressure: parseFloat(dData.bp) || 70,
            SkinThickness: parseFloat(dData.skinThickness) || 20,
            Insulin: parseFloat(dData.insulin) || 80,
            BMI: parseFloat(dData.bmi) || 25,
            DiabetesPedigreeFunction: dData.familyHistory ? 0.8 : 0.2,
            Age: parseInt(uInfo.age) || 30
        };

        // 2. Heart Payload
        const heartPayload = {
            age: parseInt(uInfo.age) || 30,
            sex: uInfo.sex === 'male' ? 1 : 0,
            trestbps: parseFloat(hData.restingBP) || 120,
            chol: parseFloat(hData.cholesterol) || 200,
            fbs: 0,
            thalach: parseFloat(hData.maxHeartRate) || 150,
            exang: hData.exerciseAngina ? 1 : 0,
            oldpeak: parseFloat(hData.oldpeak) || 0,
            ca: hData.majorVessels,
            cp: hData.chestPain === 'typical' ? '0' : hData.chestPain === 'atypical' ? '1' : hData.chestPain === 'non-anginal' ? '2' : '3',
            slope: hData.slope === 'upsloping' ? '0' : hData.slope === 'flat' ? '1' : '2',
            thal: hData.thalassemia === 'normal' ? '1' : hData.thalassemia === 'fixed' ? '2' : '3',
            restecg: '0'
        };

        // 3. Liver Payload (Handle empty lData for simulation)
        const liverPayload = {
            Age: parseInt(uInfo.age) || 30,
            Gender: uInfo.sex === 'male' ? 'Male' : 'Female',
            ...lData
        };
        const hasLiverData = Object.keys(lData).length > 0; // Check if real data exists

        // 4. Mental Health Payload
        const mentalPayload = {
            stress_level: parseInt(mData.stressLevel),
            workload: parseInt(mData.workload),
            sleep_quality: parseInt(mData.sleepQuality)
        };

        const [dRes, hRes, mRes] = await Promise.allSettled([
            api.predictDiabetes(diabetesPayload),
            api.predictHeart(heartPayload),
            api.predictMental(mentalPayload)
        ]);

        let lScore = null;
        if (!skipLiver && hasLiverData) {
            try {
                const lRes = await api.predictLiver(liverPayload);
                lScore = lRes.risk_score;
            } catch (e) {
                console.error("Liver prediction skipped/failed:", e);
                lScore = null;
            }
        }

        const dScore = dRes.status === 'fulfilled' ? dRes.value.risk_score : 20;
        const hScore = hRes.status === 'fulfilled' ? hRes.value.risk_score : 15;
        const mScore = mRes.status === 'fulfilled' ? mRes.value.risk_score : 25;

        return {
            dRisk: dScore || 0,
            hRisk: hScore || 0,
            lRisk: lScore, // Can be null
            mRisk: mScore || 0
        };
    };

    const calculateRisk = async () => {
        setIsLoading(true);
        try {
            const { dRisk, hRisk, lRisk, mRisk } = await getRiskPredictions(diabetesData, heartData, liverData, mentalData, userInfo);

            setDiabetesRisk(dRisk);
            setHeartRisk(hRisk);
            setLiverRisk(lRisk);
            setMentalRisk(mRisk);

            // Average Risk Calculation (Handle null liver)
            const factors = [dRisk, hRisk, mRisk];
            if (lRisk !== null) factors.push(lRisk);
            const total = factors.reduce((a, b) => a + b, 0);
            setOverallRisk(total / factors.length);

            // Fetch personalized recommendations
            const recPayload = {
                diabetes: { ...diabetesData },
                heart: { ...heartData },
                liver: { ...liverData },
                mental: { ...mentalData, stress_level: mentalData.stressLevel, sleep_quality: mentalData.sleepQuality }
            };
            const recs = await api.getRecommendations(recPayload);
            setRecommendations(recs);

            setIsVerified(true);

            const debugInfo = { dRisk, hRisk, lRisk, mRisk, timestamp: new Date().toISOString() };
            setDebugLog(JSON.stringify(debugInfo, null, 2));

        } catch (err) {
            console.error("Global Risk Calculation Error:", err);
        }
        setIsLoading(false);
        setStep(6); // Moving to Dashboard (Step 6 now)
    };

    const simulateRisk = async (simDiabetesData, simHeartData) => {
        // Pass empty liver data (not simulated) and current mental data
        return await getRiskPredictions(simDiabetesData, simHeartData, {}, mentalData, userInfo);
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
        theme,
        toggleTheme,
        debugLog,
        simulateRisk,
        liverData, setLiverData,
        mentalData, setMentalData,
        liverRisk, mentalRisk,
        skipLiver, setSkipLiver,
        recommendations // Export new state
    };

    return (
        <AssessmentContext.Provider value={value} >
            {children}
        </AssessmentContext.Provider >
    );
};
