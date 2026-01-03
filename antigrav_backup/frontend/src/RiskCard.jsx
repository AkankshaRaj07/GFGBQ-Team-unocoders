import React from 'react';

const RiskCard = ({ label, score, level, type = 'general' }) => {
    let colorClass, bgClass, barClass;

    switch (level) {
        case 'high':
            colorClass = 'text-rose-600';
            bgClass = 'bg-rose-50 border-rose-100';
            barClass = 'bg-gradient-to-r from-rose-500 to-red-600';
            break;
        case 'moderate':
            colorClass = 'text-amber-600';
            bgClass = 'bg-amber-50 border-amber-100';
            barClass = 'bg-gradient-to-r from-amber-400 to-amber-500';
            break;
        default:
            // Dynamic defaults based on TYPE if not high/moderate risk
            if (type === 'heart') {
                colorClass = 'text-coral-600'; // Fallback to custom logic handled below if specific Tailwind colors missing
                bgClass = 'bg-orange-50 border-orange-100';
                barClass = 'bg-gradient-to-r from-orange-400 to-red-400';
            } else if (type === 'general') {
                colorClass = 'text-purple-600';
                bgClass = 'bg-purple-50 border-purple-100';
                barClass = 'bg-gradient-to-r from-purple-400 to-indigo-500';
            } else {
                colorClass = 'text-cyan-600';
                bgClass = 'bg-cyan-50 border-cyan-100';
                barClass = 'bg-gradient-to-r from-cyan-400 to-teal-400';
            }
    }

    const renderBackground = () => {
        if (type === 'heart') {
            return (
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none overflow-hidden">
                    <svg className="w-full h-24 text-current animate-pulse" viewBox="0 0 500 150" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M0 75h100l20-40 20 80 20-40 20-20 20 20h300" className="animate-scan" strokeDasharray="500" strokeDashoffset="500" />
                    </svg>
                </div>
            );
        } else if (type === 'diabetes') {
            return (
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-4 right-4 animate-float-slow">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" /></svg>
                    </div>
                    <div className="absolute bottom-4 left-10 animate-float-slow" style={{ animationDelay: '2s' }}>
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    </div>
                </div>
            );
        } else {
            // General / DNA
            return (
                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden flex items-center justify-center">
                    <svg className="w-64 h-64 animate-rotate-slow text-current" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <path d="M50 10 Q 90 50 50 90 Q 10 50 50 10" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="30" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="50" cy="50" r="45" strokeWidth="0.5" opacity="0.5" />
                    </svg>
                </div>
            );
        }
    };

    return (
        <div className={`rounded-3xl p-6 border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white relative overflow-hidden group ${level === 'high' ? 'text-rose-500' : level === 'moderate' ? 'text-amber-500' : 'text-teal-500'}`}>

            {/* Animated Background Layer */}
            {renderBackground()}

            {/* Content Layer */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[70%]">{label}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${bgClass} ${colorClass}`}>
                        {level}
                    </span>
                </div>

                <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">{score}</span>
                    <span className="text-xl font-bold text-slate-400 mb-1.5">%</span>
                </div>

                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${barClass}`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${level === 'high' ? 'bg-rose-500' : level === 'moderate' ? 'bg-amber-500' : 'bg-teal-500'}`}></span>
                    Probabilistic Assessment
                </p>
            </div>
        </div>
    );
};

export default RiskCard;
