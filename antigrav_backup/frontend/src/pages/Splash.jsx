import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
    const navigate = useNavigate();
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => navigate('/home'), 800); // Wait for exit animation
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={`fixed inset-0 bg-[#FFFBF7] flex flex-col items-center justify-center p-6 transition-all duration-1000 ease-in-out ${exiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="text-center relative z-10 animate-fade-in-up">
                {/* Logo Icon */}
                <div className="bg-stone-900 w-32 h-32 rounded-full mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-stone-200 cursor-default relative overflow-hidden group">
                    <div className="absolute inset-0 bg-rose-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <svg className="w-14 h-14 text-[#FFFBF7] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>

                {/* Typography */}
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
                    Early<span className="italic text-rose-500">Guard</span>
                </h1>

                <p className="font-sans text-stone-500 text-lg md:text-xl font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
                    Proactive healthcare, <br /> reimagined.
                </p>

                {/* Loading Line */}
                <div className="mt-16 w-32 h-1 bg-stone-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-stone-900 w-1/3 rounded-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
            </div>

            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[120px] animate-pulse mix-blend-multiply"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-50/60 rounded-full blur-[120px] mix-blend-multiply"></div>
            </div>
        </div>
    );
};

export default Splash;
