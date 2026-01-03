import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import InfoTooltip from '../InfoTooltip';

const MentalHealthStep = () => {
    const { mentalData, setMentalData, nextStep, prevStep } = useAssessment();

    const handleChange = (e) => {
        setMentalData({ ...mentalData, [e.target.name]: e.target.value });
    };

    // Helper for range colors
    const getMoodColor = (val) => {
        if (val > 7) return 'text-rose-500';
        if (val > 4) return 'text-amber-500';
        return 'text-emerald-500';
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in-up">
            <div className="mb-8 text-center md:text-left">
                <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-white mb-2">Mental Wellness.</h2>
                <p className="text-lg text-stone-500 dark:text-stone-400">How have you been feeling lately?</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 space-y-8 relative overflow-hidden transition-colors">

                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/10 rounded-bl-[4rem] -z-0"></div>

                {/* Question 1: Stress Level */}
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <label className="font-bold text-stone-700 dark:text-stone-300 text-lg flex items-center gap-2">
                            <span className="text-2xl">🤯</span> Stress Level
                            <InfoTooltip title="Stress Level" content="Self-reported perceived stress over the last 30 days." range="0 (Zen) - 10 (High)" />
                        </label>
                        <span className={`font-bold text-xl ${getMoodColor(mentalData.stressLevel)}`}>{mentalData.stressLevel}/10</span>
                    </div>
                    <input
                        type="range"
                        name="stressLevel"
                        min="0" max="10"
                        value={mentalData.stressLevel}
                        onChange={handleChange}
                        className="w-full h-3 bg-stone-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-white"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Zen</span>
                        <span>Overwhelmed</span>
                    </div>
                </div>

                {/* Question 2: Workload */}
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <label className="font-bold text-stone-700 dark:text-stone-300 text-lg flex items-center gap-2">
                            <span className="text-2xl">💼</span> Daily Workload
                            <InfoTooltip title="Workload" content="Volume and intensity of professional/personal tasks." range="0 (Light) - 10 (Heavy)" />
                        </label>
                        <span className={`font-bold text-xl ${getMoodColor(mentalData.workload)}`}>{mentalData.workload}/10</span>
                    </div>
                    <input
                        type="range"
                        name="workload"
                        min="0" max="10"
                        value={mentalData.workload}
                        onChange={handleChange}
                        className="w-full h-3 bg-stone-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-white"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Light</span>
                        <span>Heavy</span>
                    </div>
                </div>

                {/* Question 3: Sleep Quality */}
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <label className="font-bold text-stone-700 dark:text-stone-300 text-lg flex items-center gap-2">
                            <span className="text-2xl">😴</span> Sleep Quality
                            <InfoTooltip title="Sleep Quality" content="Restfulness and duration of sleep." range="0 (Poor) - 10 (Excellent)" />
                        </label>
                        <span className={`font-bold text-xl ${getMoodColor(10 - mentalData.sleepQuality)}`}>{mentalData.sleepQuality}/10</span>
                    </div>
                    <input
                        type="range"
                        name="sleepQuality"
                        min="0" max="10"
                        value={mentalData.sleepQuality}
                        onChange={handleChange}
                        className="w-full h-3 bg-stone-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-white"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Poor</span>
                        <span>Restful</span>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={prevStep} className="px-8 py-4 rounded-2xl font-bold text-stone-500 bg-stone-50 hover:bg-stone-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">Back</button>
                    <button onClick={nextStep} className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/20 hover:bg-purple-700 transition-colors">Continue</button>
                </div>

            </div>
        </div>
    );
};

export default MentalHealthStep;
