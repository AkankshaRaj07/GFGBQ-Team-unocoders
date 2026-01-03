import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';

import InfoTooltip from '../InfoTooltip';

const BasicInfoStep = () => {
    const { userInfo, setUserInfo, nextStep } = useAssessment();

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in-up">
            <div className="mb-10 text-center md:text-left">
                <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-white mb-2">Let's get to know you.</h2>
                <p className="text-lg text-stone-500 dark:text-stone-400">We use this to calibrate the risk models for your demographic.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 space-y-8 relative overflow-hidden transition-colors">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 dark:bg-slate-700/50 rounded-bl-[4rem] -z-0"></div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 pl-1">Full Name</label>
                            <InfoTooltip title="Full Name" content="Used for your personalized report header." />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={userInfo.name}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 dark:text-white placeholder:text-stone-300 dark:placeholder:text-slate-600 text-lg"
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 pl-1">Age</label>
                                <InfoTooltip title="Age" content="Critical factor for heart and diabetes risk base rates." range="18-90" />
                            </div>
                            <input
                                type="number"
                                name="age"
                                value={userInfo.age}
                                onChange={handleChange}
                                className="w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 dark:text-white placeholder:text-stone-300 dark:placeholder:text-slate-600 text-lg"
                                placeholder="30"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 pl-1">Biological Sex</label>
                                <InfoTooltip title="Biological Sex" content="Hormonal differences affect risk baselines for heart health." />
                            </div>
                            <select
                                name="sex"
                                value={userInfo.sex}
                                onChange={handleChange}
                                className="w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 dark:text-white placeholder:text-stone-300 text-lg appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={nextStep}
                    disabled={!userInfo.name || !userInfo.age || !userInfo.sex}
                    className="w-full py-5 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl shadow-rose-200 dark:shadow-rose-900/20 transform hover:-translate-y-1 bg-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default BasicInfoStep;
