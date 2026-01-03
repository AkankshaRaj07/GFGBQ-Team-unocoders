import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';

const DetailedHistoryStep = () => {
    const {
        userInfo,
        setUserInfo,
        prevStep,
        calculateRisk,
        // Removed separate familyHistory/setFamilyHistory since we rely on diabetesData
        diabetesData,
        setDiabetesData,
        heartData,
        setHeartData
    } = useAssessment();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePregnanciesChange = (e) => {
        setUserInfo(prev => ({ ...prev, pregnancies: e.target.value }));
    };

    const handleFamilyHistoryChange = (e) => {
        const isChecked = e.target.checked;
        // Update the diabetesData to ensure it's captured in the risk calculation
        setDiabetesData(prev => ({ ...prev, familyHistory: isChecked }));
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        // Simulate a "thinking" time for the AI
        await new Promise(resolve => setTimeout(resolve, 800));
        await calculateRisk();
        setIsProcessing(false);
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in-up">
            <div className="mb-10 text-center md:text-left">
                <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-white mb-2">Detailed History.</h2>
                <p className="text-lg text-stone-500 dark:text-stone-400">A few final details to refine the prediction.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 space-y-8 relative overflow-hidden transition-colors">
                {/* Decorative Circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-[80px] -z-0 pointer-events-none opacity-60"></div>

                {userInfo.sex === 'female' && (
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-300 text-lg">🤰</div>
                            <label className="font-bold text-stone-700 dark:text-stone-300">Pregnancies</label>
                        </div>
                        <input
                            type="number"
                            value={userInfo.pregnancies}
                            onChange={handlePregnanciesChange}
                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 dark:text-white placeholder:text-stone-300 dark:placeholder:text-slate-600 text-lg"
                            placeholder="Number of pregnancies"
                        />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg">🧬</div>
                        <label className="font-bold text-stone-700 dark:text-stone-300">Family History</label>
                    </div>
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${diabetesData.familyHistory
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-sm'
                            : 'bg-stone-50 dark:bg-slate-900 border-transparent hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${diabetesData.familyHistory ? 'bg-amber-500 border-amber-500' : 'border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                            }`}>
                            {diabetesData.familyHistory && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={diabetesData.familyHistory}
                            onChange={handleFamilyHistoryChange}
                        />
                        <span className="font-medium text-stone-600 dark:text-stone-300">
                            Immediate family history of Diabetes or Heart Disease
                        </span>
                    </label>
                </div>

                {/* Chest Pain */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-lg">🫀</div>
                        <label className="font-bold text-stone-700 dark:text-stone-300">Chest Pain Type</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {['typical', 'atypical', 'non-anginal', 'asymptomatic'].map(type => (
                            <button
                                key={type}
                                onClick={() => setHeartData(prev => ({ ...prev, chestPain: type }))}
                                className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all border-2 ${heartData.chestPain === type
                                    ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-sm'
                                    : 'bg-stone-50 dark:bg-slate-900 border-transparent text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {type.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-6 relative z-10">
                    <button
                        onClick={prevStep}
                        className="px-8 py-5 rounded-2xl font-bold text-stone-500 dark:text-slate-400 bg-stone-50 dark:bg-slate-900 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className={`flex-1 py-5 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl transform hover:-translate-y-1 ${isProcessing
                                ? 'bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-wait'
                                : 'bg-stone-900 dark:bg-white text-white dark:text-slate-900 shadow-stone-300 dark:shadow-slate-900/20 hover:shadow-stone-400'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-stone-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </span>
                        ) : 'Generate Report'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailedHistoryStep;
