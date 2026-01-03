import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FFFBF7] text-stone-800 font-sans selection:bg-rose-200">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#FFFBF7]/90 backdrop-blur-md border-b border-stone-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-[#FFFBF7]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight">EarlyGuard</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                    <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it Works</a>
                    <a href="#science" className="hover:text-stone-900 transition-colors">The Science</a>
                    <a href="#stories" className="hover:text-stone-900 transition-colors">Stories</a>
                </div>
                <div className="flex items-center gap-4">
                    <button className="hidden md:block text-sm font-medium hover:text-stone-900">Log in</button>
                    <button
                        onClick={() => navigate('/assessment')}
                        className="bg-stone-900 text-[#FFFBF7] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-stone-800 transition-transform active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-stone-900">
                        Healthcare that <br />
                        <span className="italic text-rose-500">gets you</span> before <br />
                        it gets meaningful.
                    </h1>
                    <p className="text-xl text-stone-600 max-w-lg leading-relaxed">
                        We don't just treat symptoms. We predict risks. <br />
                        EarlyGuard uses your history and vitals to give you a clear, actionable health roadmap.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/assessment')}
                            className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all hover:-translate-y-1"
                        >
                            Start Your Check-up
                        </button>
                        <p className="text-sm text-stone-500 font-medium px-4">Takes 2 mins • No cost</p>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <div className="relative md:aspect-square bg-[#F2EDE6] rounded-t-[10rem] rounded-b-[3rem] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Happy healthy person"
                            className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                        <div className="absolute top-1/2 -right-12 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg transform -rotate-6 border border-white max-w-xs">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                                <span className="font-bold text-sm">Low Risk Detected</span>
                            </div>
                            <p className="text-xs text-stone-500">"I found out I was pre-diabetic early enough to fix it with just diet."</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Infinite Scroll / Marquee */}
            <div className="bg-stone-900 py-4 overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-marquee">
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">Proactive Care</span>
                    <span className="text-white/20 mx-4">•</span>
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">Holistic Health</span>
                    <span className="text-white/20 mx-4">•</span>
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">Data Driven</span>
                    <span className="text-white/20 mx-4">•</span>
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">You-Centered</span>
                    <span className="text-white/20 mx-4">•</span>
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">Proactive Care</span>
                    <span className="text-white/20 mx-4">•</span>
                    <span className="text-white/80 mx-8 font-serif italic text-2xl">Holistic Health</span>
                </div>
            </div>

            {/* "The Problem" Section */}
            <section className="py-24 px-6 md:px-12 bg-[#FDF6F0]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="bg-rose-100 aspect-[3/4] rounded-3xl overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover mix-blend-multiply" alt="Doctor" />
                                </div>
                                <div className="bg-amber-100 aspect-square rounded-3xl p-6 flex flex-col justify-between">
                                    <span className="text-4xl">📉</span>
                                    <span className="font-bold text-stone-700">Missed Signs</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-cyan-100 aspect-square rounded-3xl p-6 flex flex-col justify-between">
                                    <span className="text-4xl">🔍</span>
                                    <span className="font-bold text-stone-700">Hidden Data</span>
                                </div>
                                <div className="bg-slate-200 aspect-[3/4] rounded-3xl overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover mix-blend-multiply" alt="Analysis" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <span className="text-rose-500 font-bold tracking-wider text-sm uppercase">The Gap</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                            Healthcare is often <br /> too late.
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Most systems wait for you to get sick. We don't.
                            Silent killers like Heart Disease and Diabetes often have signs years before a diagnosis.
                            We help you find them.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                'Identify Pre-Diabetes risks instantly.',
                                'Analyze Heart Disease trends from simple vitals.',
                                'Get personalized lifestyle recommendations.'
                            ].map(item => (
                                <li key={item} className="flex items-center gap-3 text-stone-800 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 text-xs">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* How It Works (Steps) */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto" id="how-it-works">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">How EarlyGuard works</h2>
                    <p className="text-lg text-stone-600">Complex medical data, translated into a simple 3-step path to better health.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: '1. Tell us about you',
                            desc: 'Answer a few simple questions about your lifestyle and history. No needles, just data.',
                            color: 'bg-rose-50'
                        },
                        {
                            title: '2. Input Vitals',
                            desc: 'Enter basic metrics like Glucose or BP. If you don’t know them, we can help you estimate.',
                            color: 'bg-amber-50'
                        },
                        {
                            title: '3. Get Answers',
                            desc: 'Our AI analyzes your profile instantly and generates a risk report with meaningful advice.',
                            color: 'bg-cyan-50'
                        }
                    ].map((step, i) => (
                        <div key={i} className={`${step.color} p-10 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-300`}>
                            <div className="text-6xl font-serif text-stone-300 mb-6 opacity-50">{i + 1}</div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-4">{step.title}</h3>
                            <p className="text-stone-600 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 md:px-12">
                <div className="bg-[#1C1917] rounded-[3rem] p-12 md:p-24 text-center text-[#FFFBF7] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%">
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <h2 className="font-serif text-4xl md:text-6xl mb-8 relative z-10">
                        Ready to know where <br /> you stand?
                    </h2>
                    <p className="text-stone-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
                        It's free, private, and takes less than 2 minutes. Your future self will thank you.
                    </p>
                    <button
                        onClick={() => navigate('/assessment')}
                        className="bg-[#FFFBF7] text-stone-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-stone-200 transition-colors relative z-10"
                    >
                        Start Assessment Now
                    </button>
                </div>
            </section>

            <footer className="py-12 px-6 md:px-12 border-t border-stone-100 text-stone-500 text-center text-sm">
                <p>&copy; 2026 EarlyGuard AI. Built for better futures.</p>
            </footer>
        </div>
    );
};

export default Home;
