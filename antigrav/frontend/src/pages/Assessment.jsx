import React, { useState, useEffect } from 'react';
import { AssessmentProvider, useAssessment } from '../context/AssessmentContext';
import BasicInfoStep from '../components/Wizard/BasicInfoStep';
import ClinicalVitalsStep from '../components/Wizard/ClinicalVitalsStep';
import DetailedHistoryStep from '../components/Wizard/DetailedHistoryStep';
import ResultsDashboard from '../components/ResultsDashboard';
import CursorGlow from '../components/CursorGlow';
import HealthChatbot from '../components/HealthChatbot';
import { useNavigate } from 'react-router-dom';

const WizardContainer = () => {
    const { step } = useAssessment();
    const [renderStep, setRenderStep] = useState(step);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (step !== renderStep) {
            setIsTransitioning(true);
            setTimeout(() => {
                setRenderStep(step);
                setIsTransitioning(false);
            }, 300);
        }
    }, [step, renderStep]);

    const getComponent = () => {
        switch (renderStep) {
            case 1: return <BasicInfoStep />;
            case 2: return <ClinicalVitalsStep />;
            case 3: return <DetailedHistoryStep />;
            case 4: return <ResultsDashboard />;
            default: return <ResultsDashboard />;
        }
    };

    return (
        <div className={`flex-1 transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-y-4 filter blur-sm' : 'opacity-100 translate-y-0 filter blur-0'}`}>
            {getComponent()}
        </div>
    );
};

const Sidebar = () => {
    const { step, theme, toggleTheme } = useAssessment();
    const steps = [
        { id: 1, label: 'Patient Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 2, label: 'Clinical Vitals', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: 3, label: 'Medical History', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 4, label: 'Risk Analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
    ];

    return (
        <div className="w-80 bg-[#FFFBF7] border-r border-stone-100 flex flex-col h-screen fixed left-0 top-0 z-50 p-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300 font-sans">
            <div className="mb-16 flex items-center gap-3">
                <div className="bg-stone-900 p-2.5 rounded-full shadow-lg shadow-stone-900/10">
                    <svg className="w-5 h-5 text-[#FFFBF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-serif font-bold text-xl text-stone-900 tracking-tight leading-none">EarlyGuard</h1>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">Assessment</span>
                </div>
            </div>

            <nav className="space-y-3 flex-1">
                {steps.map((s) => {
                    const isActive = step === s.id;
                    const isPast = step > s.id;

                    return (
                        <div
                            key={s.id}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-rose-50 text-rose-900 shadow-sm border border-rose-100'
                                : isPast
                                    ? 'text-stone-400 opacity-60' // Past steps
                                    : 'text-stone-500 hover:bg-stone-50' // Future steps
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                                : 'bg-white border border-stone-100 text-stone-300'
                                }`}>
                                {isActive ? (
                                    <span className="text-xs font-bold">{s.id}</span>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                                )}
                            </div>
                            <span className={`font-bold text-sm tracking-wide ${isActive ? 'font-serif' : 'font-medium'}`}>{s.label}</span>
                        </div>
                    );
                })}
            </nav>

            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Live
                </h4>
                <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                    "Health is a relationship between you and your body."
                </p>
            </div>
        </div>
    );
};

const Assessment = () => {
    return (
        <AssessmentProvider>
            {/* Removed CursorGlow for cleaner look, can re-add if needed */}
            <HealthChatbot />

            <div className="min-h-screen font-sans text-stone-800 bg-[#FFFBF7] selection:bg-rose-100 selection:text-rose-900 transition-colors duration-300">
                <Sidebar />
                <main className="ml-80 p-10 min-h-screen flex items-center justify-center relative">
                    {/* Organic Background Blobs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
                    <div className="absolute bottom-0 left-80 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

                    <div className="w-full max-w-3xl relative z-10">
                        <WizardContainer />
                    </div>
                </main>
            </div>
        </AssessmentProvider>
    );
};

export default Assessment;
