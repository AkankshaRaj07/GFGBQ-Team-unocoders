import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import InfoTooltip from '../InfoTooltip';

const LiverStep = () => {
    const { liverData, setLiverData, skipLiver, setSkipLiver, nextStep, prevStep } = useAssessment();

    const handleChange = (e) => {
        setLiverData({ ...liverData, [e.target.name]: e.target.value });
    };

    // Validation Ranges (Approximate normal ranges for visual feedback)
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

    const InputGroup = ({ label, name, placeholder, tooltipContent, testName, location, value, onChange, disabled }) => {
        const val = parseFloat(value);
        const range = ranges[name] || { min: 0, max: 100 }; // Fallback
        const isOutOfRange = val && (val < range.min || val > range.max);

        return (
            <div className={`transition-opacity duration-300 ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center mb-2">
                    <label className="text-xs font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                    <InfoTooltip
                        title={label}
                        content={tooltipContent}
                        range={`${range.min} - ${range.max}`}
                        source="Lab Report"
                        testName={testName}
                        location={location}
                    />
                </div>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
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

            <div className="relative">
                {/* Decoration Container (Absolute & Overflow Hidden to clip blobs) */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 dark:bg-amber-900/10 rounded-bl-[4rem] -z-0"></div>
                </div>

                {/* Main Content Container (Relative & Visible Overflow for Tooltips) */}
                <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(231,229,228,0.5)] dark:shadow-none border border-stone-100 dark:border-slate-700 relative z-10 transition-colors">

                    <div className="grid md:grid-cols-2 gap-6 relative z-10 mb-8">
                        <InputGroup
                            label="Total Bilirubin"
                            name="Total_Bilirubin"
                            value={liverData.Total_Bilirubin}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="0.4 - 1.2 mg/dL"
                            tooltipContent="Byproduct of red blood cell breakdown. High levels (jaundice) indicate the liver isn't processing bile correctly."
                            testName="Liver Function Test (LFT) - Bilirubin"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Direct Bilirubin"
                            name="Direct_Bilirubin"
                            value={liverData.Direct_Bilirubin}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="0.1 - 0.3 mg/dL"
                            tooltipContent="Conjugated bilirubin that travels from liver to small intestine. High levels indicate blocked bile ducts."
                            testName="Liver Function Test (LFT)"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Alk. Phosphotase"
                            name="Alkaline_Phosphotase"
                            value={liverData.Alkaline_Phosphotase}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="44 - 147 IU/L"
                            tooltipContent="Enzyme found in liver and bones. High levels can suggest blocked bile ducts or bone disease."
                            testName="ALP Test"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Alamine Amino..."
                            name="Alamine_Aminotransferase"
                            value={liverData.Alamine_Aminotransferase}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="7 - 56 IU/L"
                            tooltipContent="ALT. Enzyme found mainly in the liver. High levels are a direct sign of liver cell damage."
                            testName="ALT (SGPT) Test"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Aspartate Amino..."
                            name="Aspartate_Aminotransferase"
                            value={liverData.Aspartate_Aminotransferase}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="10 - 40 IU/L"
                            tooltipContent="AST. Enzyme in heart and liver. High levels can indicate liver damage, though less specific than ALT."
                            testName="AST (SGOT) Test"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Total Proteins"
                            name="Total_Protiens"
                            value={liverData.Total_Protiens}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="6.0 - 8.3 g/dL"
                            tooltipContent="Total amount of Albumin and Globulin. Low levels can indicate liver or kidney disease."
                            testName="Total Protein Test"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="Albumin"
                            name="Albumin"
                            value={liverData.Albumin}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="3.4 - 5.4 g/dL"
                            tooltipContent="Main protein made by liver. Keeps fluid in blood from leaking. Low levels often mean liver cirrhosis."
                            testName="Albumin Blood Test"
                            location="Pathology Lab (Blood Draw)"
                        />
                        <InputGroup
                            label="A/G Ratio"
                            name="Albumin_and_Globulin_Ratio"
                            value={liverData.Albumin_and_Globulin_Ratio}
                            onChange={handleChange}
                            disabled={skipLiver}
                            placeholder="0.8 - 2.0"
                            tooltipContent="Comparison of Albumin to Globulin. Reversed ratio (low albumin, high globulin) suggests autoimmune or liver issues."
                            testName="A/G Ratio Calc"
                            location="Pathology Lab (Calculation)"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button onClick={prevStep} className="px-8 py-4 rounded-2xl font-bold text-stone-500 bg-stone-50 hover:bg-stone-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">Back</button>
                        <button onClick={nextStep} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 dark:shadow-amber-900/20 hover:bg-amber-600 transition-colors">Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiverStep;
