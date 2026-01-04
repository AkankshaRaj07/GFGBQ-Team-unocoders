import React, { useState, useRef, useEffect } from 'react';

const InfoTooltip = ({ title, content, range, source, testName, location }) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block ml-2" ref={tooltipRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-5 h-5 rounded-full bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold hover:bg-stone-300 dark:hover:bg-slate-600 transition-colors"
                aria-label="Info"
            >
                ?
            </button>

            {isOpen && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-100 dark:border-slate-700 p-5 animate-fade-in-up text-left">
                    <h5 className="font-bold text-stone-900 dark:text-white text-base mb-2">{title}</h5>
                    <p className="text-xs text-stone-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">{content}</p>

                    <div className="space-y-3 mb-3">
                        {testName && (
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 tracking-wider">Test Name</span>
                                <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">{testName}</span>
                            </div>
                        )}

                        {location && (
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 tracking-wider">Where to go</span>
                                <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">{location}</span>
                            </div>
                        )}

                        {range && (
                            <div className="bg-stone-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-stone-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Normal Range</span>
                                <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{range}</span>
                            </div>
                        )}
                    </div>

                    {source && (
                        <div className="flex items-start gap-1.5 pt-2 border-t border-stone-100 dark:border-slate-700">
                            <svg className="w-3 h-3 text-stone-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-[10px] text-stone-400 italic leading-tight">{source}</span>
                        </div>
                    )}

                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-slate-800"></div>
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
