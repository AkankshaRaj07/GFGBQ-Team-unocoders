import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import RiskCard from '../RiskCard'; // We might need to refactor RiskCard too, but let's override styles here first if possible, or assume it adapts to theme

const ResultsDashboard = () => {
    const {
        userInfo,
        diabetesData,
        heartData,
        diabetesRisk,
        heartRisk,
        overallRisk,
        isVerified,
        jumpToStep,
        debugLog
    } = useAssessment();

    // Generate Dynamic Explanations
    const explanations = [];
    if (parseFloat(diabetesData.glucose) > 140) explanations.push("High fasting glucose suggesting insulin resistance.");
    if (parseFloat(diabetesData.bmi) > 30) explanations.push("BMI indicates elevated metabolic risk factors.");
    if (heartData.chestPain !== 'typical' && heartData.chestPain !== '0') explanations.push("Reported chest pain aligns with angina patterns.");
    if (heartData.exerciseAngina) explanations.push("Exercise-induced angina is a significant cardiac indicator.");
    if (parseFloat(heartData.cholesterol) > 240) explanations.push("Elevated serum cholesterol levels detected.");

    if (explanations.length === 0) explanations.push("Key biometric markers are within optimal ranges.");

    return (
        <div className="pb-20 animate-fade-in-up">
            {/* Header Area */}
            <div className="mb-12 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Analysis Complete
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-2">
                    Wellness Report <br /> for <span className="text-rose-500 italic">{userInfo.name || 'Patient'}</span>
                </h1>
                <p className="text-xl text-stone-500 max-w-2xl">
                    We've analyzed your bio-markers using our multi-layered prediction models.
                </p>
            </div>

            {/* Main Risk Cards Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-[0_10px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform">
                    <h3 className="text-stone-500 font-bold uppercase text-xs tracking-wider mb-2">Diabetes Risk</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className={`text-4xl font-serif font-bold ${diabetesRisk > 50 ? 'text-rose-500' : 'text-stone-800'}`}>{diabetesRisk}%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${diabetesRisk > 50 ? 'bg-rose-500' : 'bg-stone-800'}`} style={{ width: `${diabetesRisk}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-[0_10px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform">
                    <h3 className="text-stone-500 font-bold uppercase text-xs tracking-wider mb-2">Heart Health</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className={`text-4xl font-serif font-bold ${heartRisk > 50 ? 'text-amber-500' : 'text-stone-800'}`}>{heartRisk}%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${heartRisk > 50 ? 'bg-amber-500' : 'bg-stone-800'}`} style={{ width: `${heartRisk}%` }}></div>
                    </div>
                </div>

                <div className="bg-stone-900 text-white p-6 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-transform relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <h3 className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-2">Composite Score</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-serif font-bold text-white">{overallRisk}%</span>
                        <span className="text-sm font-medium text-stone-400">Total Risk</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${overallRisk}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Insights Column */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-900">Clinical Insights</h3>
                                <p className="text-sm text-stone-500">Based on your provided history.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {explanations.map((exp, i) => (
                                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-stone-100 items-start">
                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></div>
                                    <p className="text-stone-700 font-medium leading-relaxed">{exp}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Metrics Column */}
                <div className="space-y-6">
                    <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100">
                        <h4 className="font-bold text-rose-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            Key Metrics
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Glucose', val: `${diabetesData.glucose} mg/dL` },
                                { label: 'Resting BP', val: `${diabetesData.bp} mmHg` },
                                { label: 'Cholesterol', val: `${heartData.cholesterol} mg/dL` },
                                { label: 'BMI', val: diabetesData.bmi },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-rose-100/50">
                                    <span className="text-stone-500 text-sm font-medium">{item.label}</span>
                                    <span className="font-bold text-stone-800">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 text-center">
                        <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-4">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        <button
                            onClick={() => jumpToStep(1)}
                            className="bg-stone-900 text-white w-full py-4 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors"
                        >
                            Start New Assessment
                        </button>
                    </div>
                </div>
            </div>
            {/* Preventive Measures Section */}
            {(diabetesRisk > 30 || heartRisk > 30) && (
                <div className="mt-12">
                    <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">🛡️</span>
                        Personalized Preventive Measures
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diabetesRisk > 30 && (
                            <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[4rem] transition-colors group-hover:bg-rose-100"></div>
                                <h3 className="font-bold text-lg text-stone-900 mb-4 relative z-10">Metabolic Health</h3>
                                <ul className="space-y-3 relative z-10">
                                    <li className="flex items-start gap-3 text-stone-600 text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0"></span>
                                        <span>Prioritize low-glycemic index foods (whole grains, legumes) to stabilize blood sugar.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-stone-600 text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0"></span>
                                        <span>Aim for 30 mins of moderate activity daily to improve insulin sensitivity.</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {heartRisk > 30 && (
                            <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] transition-colors group-hover:bg-blue-100"></div>
                                <h3 className="font-bold text-lg text-stone-900 mb-4 relative z-10">Cardiovascular Care</h3>
                                <ul className="space-y-3 relative z-10">
                                    <li className="flex items-start gap-3 text-stone-600 text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                                        <span>Reduce sodium intake to less than 2,300mg per day to manage blood pressure.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-stone-600 text-sm">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                                        <span>Incorporate omega-3 rich foods like fatty fish or walnuts.</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[4rem] transition-colors group-hover:bg-amber-100"></div>
                            <h3 className="font-bold text-lg text-stone-900 mb-4 relative z-10">General Wellness</h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="flex items-start gap-3 text-stone-600 text-sm">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                    <span>Ensure 7-9 hours of quality sleep for metabolic recovery.</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-600 text-sm">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                    <span>Practice stress-reduction techniques like deep breathing or meditation.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsDashboard;
