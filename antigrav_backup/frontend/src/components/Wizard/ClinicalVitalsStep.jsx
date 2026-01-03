import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';

const RangeSlider = ({ label, value, onChange, min, max, unit, icon, threshold = max }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    // Determine color based on threshold (if value > threshold, it's warning/danger)
    // Using a simple logic: Green for safe, Amber for elevated, Red for high
    // We can allow threshold to be a number or an object { warning: x, danger: y }

    let colorClass = 'from-emerald-400 to-green-500'; // Default Green
    let thumbClass = 'border-emerald-500';
    let textClass = 'text-emerald-600 dark:text-emerald-400';
    let bgClass = 'bg-emerald-50 dark:bg-emerald-900/30';

    if (value > threshold) {
        colorClass = 'from-rose-400 to-red-500';
        thumbClass = 'border-rose-500';
        textClass = 'text-rose-600 dark:text-rose-400';
        bgClass = 'bg-rose-50 dark:bg-rose-900/30';
    }

    return (
        <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${bgClass} ${textClass}`}>{icon}</span>
                    {label}
                </label>
                <div className={`font-mono font-bold px-3 py-1 rounded-lg text-sm ${bgClass} ${textClass}`}>
                    {value} <span className="text-xs text-slate-400 dark:text-slate-500 font-medium ml-0.5">{unit}</span>
                </div>
            </div>
            <div className="relative h-6 flex items-center group">
                {/* Track */}
                <div className="absolute w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-300 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {/* Thumb using standard range input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    className="absolute w-full h-full opacity-0 cursor-ew-resize z-10"
                />
                {/* Thumb Visual */}
                <div
                    className={`w-5 h-5 bg-white dark:bg-slate-800 border-2 ${thumbClass} rounded-full shadow-md absolute pointer-events-none transition-all duration-150 ease-out group-hover:scale-110`}
                    style={{ left: `calc(${percentage}% - 10px)` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 px-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

const ClinicalVitalsStep = () => {
    const { diabetesData, setDiabetesData, heartData, setHeartData, nextStep, prevStep } = useAssessment();

    const handleChange = (e, field, type) => {
        const val = e.target.value;
        if (type === 'diabetes') setDiabetesData({ ...diabetesData, [field]: val });
        else setHeartData({ ...heartData, [field]: val });
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Clinical Vitals</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Use the sliders to input your current measurements.</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Glucose */}
                <RangeSlider
                    label="Fasting Glucose"
                    value={diabetesData.glucose}
                    onChange={(e) => handleChange(e, 'glucose', 'diabetes')}
                    min={50} max={300} unit="mg/dL"
                    threshold={140} // High Glucose > 140
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                />

                {/* Blood Pressure */}
                <RangeSlider
                    label="Resting BP"
                    value={diabetesData.bp}
                    onChange={(e) => handleChange(e, 'bp', 'diabetes')} // Using diabetesData.bp as unified BP for now
                    min={80} max={200} unit="mm Hg"
                    threshold={130} // Hypertension > 130
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                />

                {/* Cholesterol */}
                <RangeSlider
                    label="Serum Cholesterol"
                    value={heartData.cholesterol}
                    onChange={(e) => handleChange(e, 'cholesterol', 'heart')}
                    min={100} max={500} unit="mg/dL"
                    threshold={200} // High Cholesterol > 200
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />

                {/* Max Heart Rate */}
                <RangeSlider
                    label="Max Heart Rate"
                    value={heartData.maxHeartRate}
                    onChange={(e) => handleChange(e, 'maxHeartRate', 'heart')}
                    min={60} max={220} unit="bpm"
                    threshold={180} // Example threshold
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />

                {/* Insulin */}
                <RangeSlider
                    label="Insulin Level"
                    value={diabetesData.insulin}
                    onChange={(e) => handleChange(e, 'insulin', 'diabetes')}
                    min={0} max={600} unit="mu U/ml"
                    threshold={150} // High Insulin > 150 (roughly)
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                />

                {/* BMI */}
                <RangeSlider
                    label="BMI"
                    value={diabetesData.bmi}
                    onChange={(e) => handleChange(e, 'bmi', 'diabetes')}
                    min={10} max={60} unit="kg/m²"
                    threshold={25} // Overweight > 25
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
            </div>

            <div className="flex justify-between mt-10">
                <button
                    onClick={prevStep}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default ClinicalVitalsStep;
