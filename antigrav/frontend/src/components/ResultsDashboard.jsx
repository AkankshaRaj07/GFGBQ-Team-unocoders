import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

const ResultsDashboard = () => {
    const {
        userInfo,
        diabetesData,
        heartData,
        diabetesRisk,
        heartRisk,
        liverRisk,
        mentalRisk,
        overallRisk,
        jumpToStep,
        simulateRisk
    } = useAssessment();

    // Simulation State
    const [simMode, setSimMode] = useState(false);
    const [simDiabetesData, setSimDiabetesData] = useState(diabetesData);
    const [simHeartData, setSimHeartData] = useState(heartData);
    const [simResult, setSimResult] = useState({ dRisk: null, hRisk: null });
    const [isSimulating, setIsSimulating] = useState(false);

    // 1. Explainable AI Logic (Rule-Based)
    const getTopFactors = () => {
        const factors = [];
        if (parseFloat(diabetesData.glucose) > 140) factors.push({ name: "Fasting Glucose", impact: "High", reason: "Levels above 140mg/dL significantly increase metabolic stress." });
        if (parseFloat(diabetesData.bmi) > 30) factors.push({ name: "BMI", impact: "High", reason: "Body mass index > 30 correlates with insulin resistance." });
        if (parseFloat(diabetesData.bp) > 130) factors.push({ name: "Blood Pressure", impact: "Medium", reason: "Elevated BP strains the cardiovascular system." });
        if (parseFloat(heartData.cholesterol) > 200) factors.push({ name: "Cholesterol", impact: "Medium", reason: "Serum cholesterol > 200mg/dL contributes to arterial plaque." });
        if (parseFloat(heartData.maxHeartRate) > 180) factors.push({ name: "Max Heart Rate", impact: "Low", reason: "Abnormally high heart rate detected." });

        if (factors.length === 0) factors.push({ name: "General Health", impact: "None", reason: "Major markers are within normal ranges. Good job!" });
        return factors;
    };
    const riskFactors = getTopFactors();

    // 2. Simulation Logic
    const handleSimChange = (field, value, type) => {
        if (type === 'diabetes') setSimDiabetesData(prev => ({ ...prev, [field]: value }));
        else setSimHeartData(prev => ({ ...prev, [field]: value }));
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        await new Promise(r => setTimeout(r, 600));
        const { dRisk, hRisk } = await simulateRisk(simDiabetesData, simHeartData);
        setSimResult({ dRisk, hRisk });
        setIsSimulating(false);
    };

    return (
        <div className="pb-32 animate-fade-in-up max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100 dark:border-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Verified Prediction
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-stone-900 dark:text-white mb-4 leading-tight">
                    Wellness Report
                </h1>
                <p className="text-xl text-stone-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    Here is your personalized health breakdown based on our multi-model analysis.
                </p>
            </div>

            {/* Feature: Personalized Preventive Message */}
            <PersonalizedMessage
                userInfo={userInfo}
                dRisk={diabetesRisk}
                hRisk={heartRisk}
                lRisk={liverRisk}
                mRisk={mentalRisk}
                mentalData={useAssessment().mentalData}
            />

            {/* Main Risk Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                <RiskCard title="Diabetes Risk" score={diabetesRisk} color="rose" />
                <RiskCard title="Heart Health" score={heartRisk} color="amber" />
                <RiskCard title="Liver Function" score={liverRisk} color="emerald" />
                <RiskCard title="Mental Wellness" score={mentalRisk} color="purple" />

                <div className="bg-stone-900 dark:bg-stone-800 text-white p-6 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-transform relative overflow-hidden group border border-stone-800 dark:border-stone-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                    <h3 className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-2">Composite Score</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-serif font-bold text-white">{overallRisk.toFixed(0)}%</span>
                        <span className="text-sm font-medium text-stone-400">Total Risk</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${overallRisk}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Feature 1: Explainable AI Panel */}
            <div className="mb-16 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] border border-stone-100 dark:border-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[5rem] -z-0 opacity-60"></div>
                <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mb-8 flex items-center gap-3 relative z-10">
                    <span className="text-3xl">💡</span> Why is my score this?
                </h3>
                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                    {riskFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-slate-900/50 border border-stone-100 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors">
                            <div className={`mt-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex-shrink-0 ${factor.impact === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' :
                                factor.impact === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                }`}>
                                {factor.impact}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800 dark:text-slate-200 text-lg mb-1">{factor.name}</h4>
                                <p className="text-stone-500 dark:text-slate-400 leading-relaxed font-medium text-sm">{factor.reason}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature: Guidance Panel (Recommended Actions) */}
            <GuidancePanel riskScore={overallRisk} />

            {/* Feature 2: Personalized Health Suggestions */}
            {(diabetesRisk > 20 || heartRisk > 20) && (
                <div className="mb-16 bg-emerald-50/50 dark:bg-emerald-900/10 p-8 md:p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/30">
                    <h4 className="font-serif text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 flex items-center gap-3">
                        <span className="p-2 bg-emerald-100/50 dark:bg-emerald-800/30 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">🛡️</span>
                        Personalized Recommendations
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                        {diabetesRisk > 20 && (
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:-translate-y-1 transition-transform">
                                <h5 className="font-bold text-stone-800 dark:text-slate-200 mb-3 text-lg">Metabolic Focus</h5>
                                <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-sm">Consider reducing refined sugars and increasing fiber intake to manage glucose variability.</p>
                            </div>
                        )}
                        {heartRisk > 20 && (
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:-translate-y-1 transition-transform">
                                <h5 className="font-bold text-stone-800 dark:text-slate-200 mb-3 text-lg">Cardio Focus</h5>
                                <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-sm">Regular aerobic activity (150 mins/week) is recommended to strengthen heart function.</p>
                            </div>
                        )}
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:-translate-y-1 transition-transform">
                            <h5 className="font-bold text-stone-800 dark:text-slate-200 mb-3 text-lg">General Wellness</h5>
                            <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-sm">Stay hydrated and maintain a consistent sleep schedule of 7-9 hours to aid recovery.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature 3: What-If Simulator */}
            <div id="simulator" className="mb-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30 shadow-sm relative overflow-hidden transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-serif text-3xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-3">
                            <span className="text-3xl">🧪</span> What-If Simulator
                        </h3>
                        <p className="text-indigo-600/80 dark:text-indigo-300/80 mt-2 text-md">
                            Adjust values to see estimated impact. <span className="font-bold">Does not affect medical record.</span>
                        </p>
                    </div>
                </div>

                <div className="animate-fade-in-up">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                        <SimSlider label="Glucose" value={simDiabetesData.glucose} min={50} max={300} unit="mg/dL" onChange={(e) => handleSimChange('glucose', e.target.value, 'diabetes')} />
                        <SimSlider label="BMI" value={simDiabetesData.bmi} min={10} max={60} unit="kg/m²" onChange={(e) => handleSimChange('bmi', e.target.value, 'diabetes')} />
                        <SimSlider label="BP" value={simDiabetesData.bp} min={80} max={200} unit="mmHg" onChange={(e) => handleSimChange('bp', e.target.value, 'diabetes')} />
                        <SimSlider label="Cholesterol" value={simHeartData.cholesterol} min={100} max={500} unit="mg/dL" onChange={(e) => handleSimChange('cholesterol', e.target.value, 'heart')} />
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/20 transition-all active:scale-[0.98] mb-8"
                    >
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </button>

                    {simResult.dRisk !== null && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 grid md:grid-cols-2 gap-8">
                            <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-2">Simulated Diabetes Risk</p>
                                <div className="flex items-baseline justify-center md:justify-start gap-3">
                                    <span className="text-5xl font-serif font-bold text-indigo-600 dark:text-indigo-400">{simResult.dRisk}%</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${simResult.dRisk < diabetesRisk ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                                        {simResult.dRisk < diabetesRisk ? '↓ Improved' : '↑ Worsened'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-indigo-50 dark:border-indigo-900/30 pt-6 md:pt-0 md:pl-8">
                                <p className="text-xs font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-2">Simulated Heart Risk</p>
                                <div className="flex items-baseline justify-center md:justify-start gap-3">
                                    <span className="text-5xl font-serif font-bold text-indigo-600 dark:text-indigo-400">{simResult.hRisk}%</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${simResult.hRisk < heartRisk ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                                        {simResult.hRisk < heartRisk ? '↓ Improved' : '↑ Worsened'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Final Action Area */}
            <div className="bg-stone-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-stone-100 dark:border-slate-800 text-center max-w-2xl mx-auto transition-colors">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-6">Assessment Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => jumpToStep(1)}
                        className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 w-full py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-stone-200 dark:shadow-none"
                    >
                        Start New Assessment
                    </button>
                    <p className="text-stone-400 text-sm mt-2">Data is not stored permanently. Starting over resets all inputs.</p>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const RiskCard = ({ title, score, color }) => {
    const isSkipped = score === null;
    const isHigh = !isSkipped && score > 50;

    return (
        <div className={`p-6 rounded-[2rem] border shadow-[0_10px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 transition-all
            ${isSkipped
                ? 'bg-stone-100 dark:bg-slate-800/50 border-stone-200 dark:border-slate-700 opacity-75'
                : 'bg-white dark:bg-slate-800 border-stone-100 dark:border-slate-700'
            }`}>
            <h3 className="text-stone-500 dark:text-slate-500 font-bold uppercase text-xs tracking-wider mb-2">{title}</h3>

            {isSkipped ? (
                <div>
                    <span className="text-xl font-serif font-bold text-stone-400 dark:text-slate-500">Not Analyzed</span>
                    <p className="text-[10px] text-stone-400 mt-2 leading-tight">Insufficient or skipped data.</p>
                </div>
            ) : (
                <>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className={`text-4xl font-serif font-bold ${isHigh ? (color === 'rose' ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400') : 'text-stone-800 dark:text-white'}`}>{score.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isHigh ? (color === 'rose' ? 'bg-rose-500' : 'bg-amber-500') : 'bg-stone-800 dark:bg-slate-500'}`} style={{ width: `${score}%` }}></div>
                    </div>
                </>
            )}
        </div>
    );
};

const SimSlider = ({ label, value, min, max, unit, onChange }) => (
    <div>
        <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">{label}</label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md">{value} {unit}</span>
        </div>
        <input
            type="range" min={min} max={max} value={value} onChange={onChange}
            className="w-full h-2 bg-indigo-200 dark:bg-indigo-900/40 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 hover:accent-indigo-500 transition-all"
        />
        <div className="flex justify-between text-[10px] text-indigo-300 dark:text-indigo-400/50 font-medium mt-1">
            <span>{min}</span>
            <span>{max}</span>
        </div>
    </div>
);

// Feature Component: Guidance Panel
const GuidancePanel = ({ riskScore }) => {
    let category = 'Low';
    if (riskScore > 70) category = 'High';
    else if (riskScore > 30) category = 'Moderate';

    const content = {
        Low: {
            do: [
                "Maintain a balanced diet rich in whole foods",
                "Continue 150 mins of moderate activity weekly",
                "Schedule annual health checkups",
                "Stay hydrated (8 glasses/day)"
            ],
            avoid: [
                "Ignoring minor symptoms or changes",
                "Prolonged periods of inactivity (> 2 hours)",
                "Skipping meals or irregular eating"
            ]
        },
        Moderate: {
            do: [
                "Reduce daily sodium and sugar intake",
                "Increase cardio activity to 30 mins/day",
                "Monitor blood pressure weekly",
                "Practice daily stress management (meditation)"
            ],
            avoid: [
                "Sedentary lifestyle (sitting all day)",
                "Processed foods high in trans fats",
                "Irregular sleep patterns (< 6 hours)"
            ]
        },
        High: {
            do: [
                "Consult a specialist immediately",
                "Follow a strict low-glycemic, low-sodium diet",
                "Monitor vitals (BP, Glucose) daily",
                "Prioritize 7-9 hours of restorative sleep"
            ],
            avoid: [
                "Delaying medical advice or medication",
                "High-sugar, high-fat, or fried foods",
                "Smoking and alcohol consumption",
                "High-stress environments without breaks"
            ]
        }
    };

    const activeContent = content[category];

    return (
        <div className="mb-16 animate-fade-in-up">
            <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span> Recommended Actions
                <span className={`text-sm font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${category === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200' :
                    category === 'Moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200' :
                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                    }`}>
                    {category} Risk Protocol
                </span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Do's */}
                <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/30 relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-800/20 rounded-bl-[4rem] -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-xl mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300">✅</span>
                        What You Should Do
                    </h4>
                    <ul className="space-y-4 relative z-10">
                        {activeContent.do.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                <span className="text-stone-700 dark:text-slate-300 font-medium leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Avoids */}
                <div className="p-8 bg-rose-50/50 dark:bg-rose-900/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-800/30 relative overflow-hidden group hover:border-rose-200 dark:hover:border-rose-700 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 dark:bg-rose-800/20 rounded-bl-[4rem] -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <h4 className="font-bold text-rose-800 dark:text-rose-200 text-xl mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-300">🛑</span>
                        What To Avoid
                    </h4>
                    <ul className="space-y-4 relative z-10">
                        {activeContent.avoid.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                <span className="text-stone-700 dark:text-slate-300 font-medium leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <p className="mt-4 text-center text-xs text-stone-400 dark:text-slate-500">
                * These suggestions are informational and not a substitute for professional medical advice.
            </p>
        </div>
    );
};

const PersonalizedMessage = ({ userInfo, dRisk, hRisk, lRisk, mRisk, mentalData }) => {
    // 1. Determine Overall Risk Category
    const risks = [dRisk, hRisk, lRisk, mRisk].filter(r => r !== null);
    const maxRisk = Math.max(...risks);

    let category = 'Low';
    if (maxRisk > 50) category = 'High';
    else if (maxRisk > 25) category = 'Moderate';

    // 2. Generate Dynamic Suggestions based on specific inputs
    const suggestions = [];

    // Sleep Check
    if (mentalData.sleepQuality < 6) {
        suggestions.push("Prioritize getting 7-9 hours of quality sleep to aid recovery.");
    } else {
        suggestions.push("Keep maintaining your good sleep schedule.");
    }

    // Stress Check
    if (mentalData.stressLevel > 6) {
        suggestions.push("Incorporate 10 mins of daily mindfulness to lower cortisol levels.");
    }

    // Activity/General (Base on risk type)
    if (dRisk > 30 || hRisk > 30) {
        suggestions.push("A 15-minute post-meal walk can significantly stabilize blood sugar.");
    } else {
        suggestions.push("Stay active with your favorite light exercises.");
    }

    // 3. Construct Message Parts
    const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'there';

    const messages = {
        Low: {
            title: `You're doing great, ${firstName}! 🌱`,
            body: "Your health indicators look stable. You're building a strong foundation for long-term wellness.",
            color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
        },
        Moderate: {
            title: `You're on the right track, ${firstName} 👍`,
            body: "A few small adjustments to your routine could make a big positive difference.",
            color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200"
        },
        High: {
            title: `Thanks for checking in, ${firstName} 💙`,
            body: "Some indicators suggest higher risk, but taking early action now is the most powerful step you can take.",
            color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200"
        }
    };

    const msg = messages[category];

    return (
        <div className={`mb-12 p-8 rounded-[2.5rem] border ${msg.color} relative overflow-hidden animate-fade-in-up shadow-sm`}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="font-serif text-3xl font-bold mb-4">{msg.title}</h2>
                <p className="text-lg opacity-90 mb-6 font-medium leading-relaxed max-w-3xl">
                    {msg.body}
                </p>

                <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h5 className="font-bold text-sm uppercase tracking-wider opacity-70 mb-3 flex items-center gap-2">
                        <span>✨</span> Tailored Suggestions
                    </h5>
                    <ul className="space-y-3">
                        {suggestions.slice(0, 3).map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-3 text-base font-medium">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResultsDashboard;
