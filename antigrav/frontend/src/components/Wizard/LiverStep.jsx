import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import InfoTooltip from '../InfoTooltip';

const LiverStep = () => {
    const { liverData, setLiverData, skipLiver, setSkipLiver, nextStep, prevStep } = useAssessment();

    const handleChange = (e) => {
        setLiverData({ ...liverData, [e.target.name]: e.target.value });
    };

    // Validation Ranges (Approximate normal ranges for visual feedback)
    const ranges = {
        Total_Bilirubin: { min: 0.1, max: 1.2 },
        Direct_Bilirubin: { min: 0.1, max: 0.3 },
        Alkaline_Phosphotase: { min: 44, max: 147 },
        Alamine_Aminotransferase: { min: 7, max: 56 },
        Aspartate_Aminotransferase: { min: 10, max: 40 },
        Total_Protiens: { min: 6.0, max: 8.3 },
        Albumin: { min: 3.4, max: 5.4 },
        Albumin_and_Globulin_Ratio: { min: 0.8, max: 2.0 }
    };

    const InputGroup = ({ label, name, placeholder, tooltipContent }) => {
        const val = parseFloat(liverData[name]);
        const range = ranges[name];
        const isOutOfRange = val && (val < range.min || val > range.max);

        return (
            <div className={`transition-opacity duration-300 ${skipLiver ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center mb-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                    <InfoTooltip
                        title={label}
                        content={tooltipContent}
                        range={`${range.min} - ${range.max}`}
                        source="Lab Report"
                    />
                </div>
                <input
                    type="number"
                    name={name}
                    value={liverData[name]}
                    onChange={handleChange}
                    disabled={skipLiver}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium text-stone-800 dark:text-white
                        ${isOutOfRange
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 focus:border-red-400'
                            : 'bg-stone-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                        }`}
                    placeholder={placeholder}
                />
                {isOutOfRange && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
                        ⚠️ Value outside typical normal range
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="mb-8 text-center md:text-left">
                <h2 className="font-serif text-4xl font-bold text-stone-900 dark:text-white mb-2">Liver Function.</h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-lg text-stone-500 dark:text-stone-400">Enter recent lab values if available.</p>

                    <label className="flex items-center gap-3 cursor-pointer bg-stone-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={skipLiver}
                            onChange={(e) => setSkipLiver(e.target.checked)}
                            className="w-5 h-5 rounded-md text-amber-500 focus:ring-amber-500 border-gray-300"
                        />
                        <span className="font-bold text-stone-600 dark:text-slate-300 text-sm">Skip Liver Assessment</span>
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 dark:bg-amber-900/10 rounded-bl-[4rem] -z-0 pointer-events-none"></div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10 mb-8">
                    <InputGroup
                        label="Total Bilirubin"
                        name="Total_Bilirubin"
                        placeholder="0.4 - 1.2 mg/dL"
                        tooltipContent="Byproduct of red blood cell breakdown. High levels may indicate liver issues."
                    />
                    <InputGroup
                        label="Direct Bilirubin"
                        name="Direct_Bilirubin"
                        placeholder="0.1 - 0.3 mg/dL"
                        tooltipContent="Conjugated bilirubin processed by the liver. Elevated levels suggest blockage."
                    />
                    <InputGroup
                        label="Alk. Phosphotase"
                        name="Alkaline_Phosphotase"
                        placeholder="44 - 147 IU/L"
                        tooltipContent="Enzyme related to bile flow. High levels can check for blocked bile ducts."
                    />
                    <InputGroup
                        label="Alamine Amino..."
                        name="Alamine_Aminotransferase"
                        placeholder="7 - 56 IU/L"
                        tooltipContent="ALT. Enzyme found in liver cells. High levels suggest liver damage."
                    />
                    <InputGroup
                        label="Aspartate Amino..."
                        name="Aspartate_Aminotransferase"
                        placeholder="10 - 40 IU/L"
                        tooltipContent="AST. Enzyme found in heart and liver. Used to detect liver injury."
                    />
                    <InputGroup
                        label="Total Proteins"
                        name="Total_Protiens"
                        placeholder="6.0 - 8.3 g/dL"
                        tooltipContent="Measure of albumin and globulin. Low levels can indicate liver disease."
                    />
                    <InputGroup
                        label="Albumin"
                        name="Albumin"
                        placeholder="3.4 - 5.4 g/dL"
                        tooltipContent="Protein made by liver. Keeps fluid in bloodstream. Low levels indicate issue."
                    />
                    <InputGroup
                        label="A/G Ratio"
                        name="Albumin_and_Globulin_Ratio"
                        placeholder="0.8 - 2.0"
                        tooltipContent="Ratio of Albumin to Globulin. Helps differentiate liver disease types."
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={prevStep} className="px-8 py-4 rounded-2xl font-bold text-stone-500 bg-stone-50 hover:bg-stone-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">Back</button>
                    <button onClick={nextStep} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 dark:shadow-amber-900/20 hover:bg-amber-600 transition-colors">Continue</button>
                </div>
            </div>
        </div>
    );
};

export default LiverStep;
