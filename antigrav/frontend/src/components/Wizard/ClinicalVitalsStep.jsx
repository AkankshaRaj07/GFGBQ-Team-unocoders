import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';



// Updated RangeSlider (Same as before)
import InfoTooltip from '../InfoTooltip';

// Updated RangeSlider
const RangeSlider = ({ label, value, onChange, min, max, unit, icon, normalRange, tooltipContent, testName, location }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const isNormal = value >= normalRange.min && value <= normalRange.max;

    let colorClass = isNormal ? 'from-blue-400 to-indigo-500' : 'from-rose-400 to-red-500';
    let bgClass = isNormal ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    let trackClass = isNormal ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-rose-100 dark:bg-rose-900/20';
    let containerClass = isNormal ? 'border-blue-100 dark:border-blue-900/30' : 'border-rose-100 dark:border-rose-900/30 shadow-md ring-1 ring-rose-100 dark:ring-rose-800';

    return (
        <div className={`mb-6 p-4 rounded-2xl transition-all duration-300 border ${containerClass} dark:bg-slate-800/40`}>
            <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-bold text-stone-700 dark:text-slate-300 flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-lg ${isNormal ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-rose-100 dark:bg-rose-900/40'}`}>{icon}</span>
                    <div className="flex items-center gap-2">
                        <span>{label}</span>
                        <InfoTooltip
                            title={label}
                            content={tooltipContent}
                            range={`${normalRange.min} - ${normalRange.max} ${unit}`}
                            source="Clinical Guidelines"
                            testName={testName}
                            location={location}
                        />
                    </div>
                </label>
                <div className={`font-mono font-bold px-3 py-1.5 rounded-xl text-sm border ${bgClass}`}>
                    {value} <span className="text-xs opacity-70 ml-0.5">{unit}</span>
                </div>
            </div>

            <div className="relative h-6 flex items-center group">
                <div className={`absolute w-full h-2 rounded-full overflow-hidden ${trackClass}`}>
                    <div className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-300 ease-out`} style={{ width: `${percentage}%` }} />
                </div>
                <input type="range" min={min} max={max} value={value} onChange={onChange} className="absolute w-full h-full opacity-0 cursor-ew-resize z-10" />
                <div className={`w-6 h-6 bg-white dark:bg-slate-700 border-4 ${isNormal ? 'border-blue-500 dark:border-blue-400' : 'border-rose-500 dark:border-rose-400'} rounded-full shadow-md absolute pointer-events-none transition-all duration-150 ease-out group-hover:scale-110`} style={{ left: `calc(${percentage}% - 12px)` }} />
            </div>

            <div className="flex justify-between items-start mt-1 px-1">
                <div className="flex gap-4 text-[10px] text-stone-400 dark:text-slate-600 font-medium">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
                {!isNormal && (
                    <span className="text-[10px] font-bold text-rose-500 animate-pulse">
                        ⚠️ Outside typical range
                    </span>
                )}
            </div>
        </div>
    );
};

const ClinicalVitalsStep = () => {
    const { diabetesData, setDiabetesData, heartData, setHeartData, nextStep, prevStep } = useAssessment();
    const [lifestyleBadge, setLifestyleBadge] = useState(null);

    const handleChange = (e, field, type) => {
        const val = e.target.value;
        if (type === 'diabetes') setDiabetesData({ ...diabetesData, [field]: val });
        else setHeartData({ ...heartData, [field]: val });
    };



    return (
        <div className="animate-fade-in-up max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-white mb-2">Check your Vitals.</h2>
            <p className="text-lg text-stone-500 dark:text-slate-400 mb-8">Enter your values below.</p>



            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 space-y-2 relative transition-colors">
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <RangeSlider
                        label="Fasting Glucose"
                        value={diabetesData.glucose}
                        onChange={(e) => handleChange(e, 'glucose', 'diabetes')}
                        min={50} max={300} unit="mg/dL"
                        normalRange={{ min: 70, max: 99 }}
                        icon="🍭"
                        tooltipContent="Blood sugar level after 8 hours of fasting. Key indicator for diabetes."
                        testName="Fasting Plasma Glucose (FPG)"
                        location="Pathology Lab / Home Glucometer"
                    />
                    <RangeSlider
                        label="Resting BP"
                        value={diabetesData.bp}
                        onChange={(e) => handleChange(e, 'bp', 'diabetes')}
                        min={80} max={200} unit="mm Hg"
                        normalRange={{ min: 90, max: 120 }}
                        icon="🩸"
                        tooltipContent="Pressure in arteries when heart rests between beats. High values strain the heart."
                        testName="Blood Pressure Reading"
                        location="Doctor's Clinic / Pharmacy / Home Monitor"
                    />
                    <RangeSlider
                        label="Serum Cholesterol"
                        value={heartData.cholesterol}
                        onChange={(e) => handleChange(e, 'cholesterol', 'heart')}
                        min={100} max={500} unit="mg/dL"
                        normalRange={{ min: 100, max: 199 }}
                        icon="🍟"
                        tooltipContent="Total amount of cholesterol in blood. High levels can lead to clogged arteries."
                        testName="Lipid Profile"
                        location="Pathology Lab (Blood Draw)"
                    />
                    <RangeSlider
                        label="Max Heart Rate"
                        value={heartData.maxHeartRate}
                        onChange={(e) => handleChange(e, 'maxHeartRate', 'heart')}
                        min={60} max={220} unit="bpm"
                        normalRange={{ min: 100, max: 190 }}
                        icon="❤️"
                        tooltipContent="Highest heart rate achieved during maximum physical exertion."
                        testName="Cardiac Stress Test"
                        location="Cardiology Center"
                    />
                    <RangeSlider
                        label="Insulin Level"
                        value={diabetesData.insulin}
                        onChange={(e) => handleChange(e, 'insulin', 'diabetes')}
                        min={0} max={600} unit="mu U/ml"
                        normalRange={{ min: 3, max: 25 }}
                        icon="💉"
                        tooltipContent="Hormone that regulates blood sugar. High levels may indicate insulin resistance."
                        testName="Fasting Insulin / C-Peptide"
                        location="Pathology Lab (Blood Draw)"
                    />
                    <RangeSlider
                        label="BMI"
                        value={diabetesData.bmi}
                        onChange={(e) => handleChange(e, 'bmi', 'diabetes')}
                        min={10} max={60} unit="kg/m²"
                        normalRange={{ min: 18.5, max: 24.9 }}
                        icon="⚖️"
                        tooltipContent="Body Mass Index. Measure of body fat based on height and weight."
                        testName="Body Composition Analysis"
                        location="Home Calculation / Gym / Clinic"
                    />
                </div>
                <div className="flex justify-between mt-10 pt-6 border-t border-stone-100 dark:border-slate-700">
                    <button onClick={prevStep} className="text-stone-500 dark:text-slate-400 font-bold hover:text-stone-800 dark:hover:text-slate-200 px-6 py-3 transition-colors">Back</button>
                    <button onClick={nextStep} className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-stone-300 dark:shadow-slate-900/20">Detailed History →</button>
                </div>
            </div>
        </div>
    );
};
export default ClinicalVitalsStep;
