import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';

const BasicInfoStep = () => {
    const { userInfo, setUserInfo, nextStep } = useAssessment();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const isComplete = userInfo.name && userInfo.age && userInfo.sex;

    return (
        <div className="max-w-xl mx-auto animate-fade-in-up">
            <div className="mb-10 text-center md:text-left">
                <h2 className="font-serif text-4xl font-bold text-stone-900 mb-2">Let's get to know you.</h2>
                <p className="text-lg text-stone-500">We use this to calibrate the risk models for your demographic.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] border border-stone-100 space-y-8 relative overflow-hidden">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-[4rem] -z-0"></div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 pl-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userInfo.name}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 placeholder:text-stone-300 text-lg"
                            placeholder="Ex. Sarah Connor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 pl-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={userInfo.age}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-stone-800 placeholder:text-stone-300 text-lg"
                            placeholder="Years"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 pl-1">Biological Sex</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['male', 'female'].map(gender => (
                                <button
                                    key={gender}
                                    onClick={() => setUserInfo(prev => ({ ...prev, sex: gender }))}
                                    className={`py-4 px-6 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 capitalize text-lg ${userInfo.sex === gender
                                        ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200'
                                        : 'bg-stone-50 border-transparent text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                                        }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={nextStep}
                    disabled={!isComplete}
                    className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl transform ${isComplete
                        ? 'bg-rose-500 text-white shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-1'
                        : 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none'
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default BasicInfoStep;
