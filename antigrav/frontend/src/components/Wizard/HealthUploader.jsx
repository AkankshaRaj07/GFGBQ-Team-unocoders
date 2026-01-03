import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const HealthUploader = ({ onDataExtracted }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState(null);
    const [ocrStatus, setOcrStatus] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Form State for User Confirmation
    const [manualMetrics, setManualMetrics] = useState({
        glucose: '',
        heartRate: '',
        steps: '',
        sleep: ''
    });

    const processImage = (file) => {
        setIsProcessing(true);
        setOcrStatus('Scanning image for health data...');
        setPreview(URL.createObjectURL(file));

        Tesseract.recognize(
            file,
            'eng',
            { logger: m => { if (m.status === 'recognizing text') setOcrStatus(`Extracting... ${(m.progress * 100).toFixed(0)}%`); } }
        ).then(({ data: { text } }) => {
            const extracted = parseMetrics(text);
            // Pre-fill form with extracted data (best effort)
            setManualMetrics(prev => ({ ...prev, ...extracted }));
            setIsProcessing(false);
            setShowConfirmation(true);
        }).catch(err => {
            console.error(err);
            setOcrStatus('Could not read text. Please enter manually.');
            setIsProcessing(false);
            setShowConfirmation(true); // Still show form for manual entry
        });
    };

    const parseMetrics = (text) => {
        const found = {};
        const lowered = text.toLowerCase();

        // 1. Glucose
        const glMatch = lowered.match(/(?:glucose|sugar)[\s:]*(\d{2,3})/i);
        if (glMatch) found.glucose = parseInt(glMatch[1]);

        // 2. Heart Rate (Avg or Max)
        const hrMatch = lowered.match(/(?:heart rate|bpm|pulse)[\s:]*(\d{2,3})/i);
        if (hrMatch) found.heartRate = parseInt(hrMatch[1]);

        // 3. Steps
        const stepsMatch = lowered.match(/(?:steps|count)[\s:]*(\d{1,5}(?:,\d{3})?)/i);
        if (stepsMatch) found.steps = parseInt(stepsMatch[1].replace(/,/g, ''));

        // 4. Sleep (Hours)
        const sleepMatch = lowered.match(/(?:sleep|duration)[\s:]*(\d{1,2}(?:\.\d)?)/i);
        if (sleepMatch) found.sleep = parseFloat(sleepMatch[1]);

        return found;
    };

    const handleConfirm = () => {
        // Send only valid confirmed numbers
        const cleanData = {};
        if (manualMetrics.glucose) cleanData.glucose = parseFloat(manualMetrics.glucose);
        if (manualMetrics.heartRate) cleanData.maxHeartRate = parseFloat(manualMetrics.heartRate); // Mapping to MaxHR input
        if (manualMetrics.steps) cleanData.steps = parseInt(manualMetrics.steps);
        if (manualMetrics.sleep) cleanData.sleep = parseFloat(manualMetrics.sleep);

        onDataExtracted(cleanData);

        // Reset
        setPreview(null);
        setShowConfirmation(false);
        setManualMetrics({ glucose: '', heartRate: '', steps: '', sleep: '' });
    };

    const handleCancel = () => {
        setPreview(null);
        setShowConfirmation(false);
        setManualMetrics({ glucose: '', heartRate: '', steps: '', sleep: '' });
    };

    return (
        <div className="mb-8 animate-fade-in-up">
            {!showConfirmation ? (
                <div className="p-6 bg-stone-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-stone-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 transition-colors cursor-pointer group relative">
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg"
                        onChange={(e) => e.target.files[0] && processImage(e.target.files[0])}
                        disabled={isProcessing}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            {isProcessing ? <span className="animate-spin">⏳</span> : <span className="text-2xl">📸</span>}
                        </div>
                        <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-1">
                            {isProcessing ? 'Analyzing Image...' : 'Upload Health Report / Screenshot'}
                        </h4>
                        <p className="text-sm text-stone-500 dark:text-slate-400 max-w-xs">
                            {isProcessing ? ocrStatus : 'Auto-extract metrics to assist your assessment.'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-stone-200 dark:border-slate-700 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        {preview && <img src={preview} alt="Report snippet" className="w-16 h-16 rounded-xl object-cover border border-stone-100 dark:border-slate-700" />}
                        <div>
                            <h4 className="font-bold text-stone-800 dark:text-white text-lg">Verify Extracted Data</h4>
                            <p className="text-sm text-stone-500 dark:text-slate-400">Please confirm or correct the values below.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">Glucose (mg/dL)</label>
                            <input
                                type="number"
                                value={manualMetrics.glucose}
                                onChange={e => setManualMetrics(p => ({ ...p, glucose: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border focus:border-rose-500 outline-none dark:text-white font-bold"
                                placeholder="--"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">Heart Rate (BPM)</label>
                            <input
                                type="number"
                                value={manualMetrics.heartRate}
                                onChange={e => setManualMetrics(p => ({ ...p, heartRate: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border focus:border-rose-500 outline-none dark:text-white font-bold"
                                placeholder="--"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">Daily Steps</label>
                            <input
                                type="number"
                                value={manualMetrics.steps}
                                onChange={e => setManualMetrics(p => ({ ...p, steps: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border focus:border-rose-500 outline-none dark:text-white font-bold"
                                placeholder="--"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">Sleep (Hours)</label>
                            <input
                                type="number"
                                value={manualMetrics.sleep}
                                onChange={e => setManualMetrics(p => ({ ...p, sleep: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border focus:border-rose-500 outline-none dark:text-white font-bold"
                                placeholder="--"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-3 bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-colors"
                        >
                            Confirm & Use
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthUploader;
