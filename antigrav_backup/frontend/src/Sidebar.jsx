import React from 'react';

const Sidebar = ({ healthData, setHealthData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHealthData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    };

    return (
        <aside className="w-80 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-screen overflow-y-auto font-sans">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                    Input Parameters
                </h2>
                <p className="text-sm text-slate-500 mt-1">Configure patient metrics</p>
            </div>

            <div className="p-6 space-y-8">
                {/* Demographics */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demographics</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Age <span className="text-blue-600">{healthData.age}</span>
                        </label>
                        <input
                            type="range"
                            name="age"
                            min="18"
                            max="100"
                            value={healthData.age}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            BMI <span className="text-blue-600">{healthData.bmi}</span>
                        </label>
                        <input
                            type="range"
                            name="bmi"
                            min="15"
                            max="40"
                            step="0.1"
                            value={healthData.bmi}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>
                </div>

                {/* Vitals */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vitals</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Systolic BP <span className="text-blue-600">{healthData.systolicBP}</span>
                        </label>
                        <input
                            type="range"
                            name="systolicBP"
                            min="90"
                            max="200"
                            value={healthData.systolicBP}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Diastolic BP <span className="text-blue-600">{healthData.diastolicBP}</span>
                        </label>
                        <input
                            type="range"
                            name="diastolicBP"
                            min="60"
                            max="130"
                            value={healthData.diastolicBP}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Cholesterol <span className="text-blue-600">{healthData.cholesterol}</span>
                        </label>
                        <input
                            type="range"
                            name="cholesterol"
                            min="100"
                            max="300"
                            value={healthData.cholesterol}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>
                </div>

                {/* Behavior */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifestyle</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Activity Level (Hrs/Wk) <span className="text-blue-600">{healthData.activityLevel}</span>
                        </label>
                        <input
                            type="range"
                            name="activityLevel"
                            min="0"
                            max="10"
                            value={healthData.activityLevel}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">Smoker</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isSmoker"
                                checked={healthData.isSmoker}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">Diabetic</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isDiabetic"
                                checked={healthData.isDiabetic}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
                <button
                    onClick={() => setHealthData({
                        age: 45,
                        bmi: 24,
                        systolicBP: 120,
                        diastolicBP: 80,
                        cholesterol: 180,
                        activityLevel: 3,
                        isSmoker: false,
                        isDiabetic: false
                    })}
                    className="w-full py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                >
                    Reset Defaults
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
