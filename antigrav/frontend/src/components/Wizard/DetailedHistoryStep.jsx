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
                <h2 className="font-serif text-4xl font-bold text-stone-900 mb-2">Detailed History.</h2>
                <p className="text-lg text-stone-500">A few final details to refine the prediction.</p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] border border-stone-100 space-y-8 relative overflow-hidden">
                {/* Decorative Circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[80px] -z-0 pointer-events-none opacity-60"></div>

                {userInfo.sex === 'female' && (
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 text-lg">🤰</div>
                            <label className="font-bold text-stone-700">Pregnancies</label>
                        </div>
                        <input
                            type="number"
                            value={userInfo.pregnancies}
                            onChange={handlePregnanciesChange}
                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 placeholder:text-stone-300 text-lg"
                            placeholder="Number of pregnancies"
                        />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-lg">🧬</div>
                        <label className="font-bold text-stone-700">Family History</label>
                    </div>
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${diabetesData.familyHistory
                            ? 'bg-amber-50 border-amber-200 shadow-sm'
                            : 'bg-stone-50 border-transparent hover:bg-stone-100'
                        }`}>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${diabetesData.familyHistory ? 'bg-amber-500 border-amber-500' : 'border-stone-300 bg-white'
                            }`}>
                            {diabetesData.familyHistory && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={diabetesData.familyHistory}
                            onChange={handleFamilyHistoryChange}
                        />
                        <span className="font-medium text-stone-600">
                            Immediate family history of Diabetes or Heart Disease
                        </span>
                    </label>
                </div>

                {/* Chest Pain */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-lg">🫀</div>
                        <label className="font-bold text-stone-700">Chest Pain Type</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {['typical', 'atypical', 'non-anginal', 'asymptomatic'].map(type => (
                            <button
                                key={type}
                                onClick={() => setHeartData(prev => ({ ...prev, chestPain: type }))}
                                className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all border-2 ${heartData.chestPain === type
                                    ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm'
                                    : 'bg-stone-50 border-transparent text-stone-500 hover:bg-stone-100'
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
                        className="px-8 py-5 rounded-2xl font-bold text-stone-500 bg-stone-50 hover:bg-stone-100 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className={`flex-1 py-5 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl transform hover:-translate-y-1 ${isProcessing
                                ? 'bg-stone-100 text-stone-400 cursor-wait'
                                : 'bg-stone-900 text-white shadow-stone-300 hover:shadow-stone-400'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
