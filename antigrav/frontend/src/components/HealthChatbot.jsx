import React, { useState, useRef, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';

const HealthChatbot = () => {
    const { userInfo, diabetesData, heartData } = useAssessment();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hello! I'm your SilentRisk AI. I can analyze your current indicators. Ask me about your glucose or heart metrics." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = generateResponse(inputValue);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    // Comprehensive Knowledge Base
    const knowledgeBase = {
        glucose: {
            keywords: ['glucose', 'sugar', 'diabetic', 'diabetes', 'fasting'],
            definition: "Glucose is the main sugar in your blood and body's primary energy source. High levels can indicate diabetes.",
            improvement: "Eat complex carbs (whole grains), fiber-rich foods, and leafy greens. Avoid sugary drinks and processed snacks.",
            tests: "Fasting Blood Sugar (FBS), HbA1c (3-month average), and Oral Glucose Tolerance Test (OGTT)."
        },
        bp: {
            keywords: ['bp', 'blood pressure', 'hypertension', 'systolic', 'diastolic'],
            definition: "Blood pressure is the force of blood against artery walls. High BP (Hypertension) strains the heart.",
            improvement: "Reduce sodium (salt) intake, manage stress, exercise regularly, and eat potassium-rich foods like bananas.",
            tests: "Sphygmomanometer check (standard BP cuff), Ambulatory BP monitoring."
        },
        cholesterol: {
            keywords: ['cholesterol', 'lipid', 'ldl', 'hdl', 'fat'],
            definition: "A waxy substance used to build cells. LDL is 'bad' (clogs arteries), HDL is 'good' (clears them).",
            improvement: "Avoid saturated/trans fats (fried food, red meat). Eat more soluble fiber (oats) and omega-3s (fish, walnuts).",
            tests: "Lipid Profile (Total, LDL, HDL, Triglycerides)."
        },
        heartrate: {
            keywords: ['heart rate', 'pulse', 'bpm', 'beats', 'tachycardia'],
            definition: "The number of times your heart beats per minute. Resting HR > 100 (Tachycardia) can indicate stress or issues.",
            improvement: "Regular aerobic exercise (running, swimming) strengthens the heart and lowers resting heart rate.",
            tests: "ECG (Electrocardiogram), Holter Monitor, Stress Test."
        },
        bmi: {
            keywords: ['bmi', 'body mass', 'weight', 'obesity', 'overweight'],
            definition: "Body Mass Index (BMI) estimates body fat based on height and weight. >25 is overweight, >30 is obese.",
            improvement: "Caloric deficit diet, regular physical activity, and strength training to build muscle.",
            tests: "Body Composition Analysis, Waist-to-Hip Ratio."
        },
        insulin: {
            keywords: ['insulin', 'hormone', 'resistance'],
            definition: "A hormone that helps enter cells for energy. High levels often mean Insulin Resistance.",
            improvement: "Intermittent fasting, low-carb diets (Keto), and regular exercise improve insulin sensitivity.",
            tests: "Fasting Insulin Level, HOMA-IR."
        },
        stress: {
            keywords: ['stress', 'cortisol', 'anxiety', 'mental', 'tension'],
            definition: "Body's reaction to pressure. Chronic stress raises Cortisol, damaging heart and metabolic health.",
            improvement: "Mindfulness meditation, deep breathing exercises, adequate sleep, and therapy.",
            tests: "Salivary Cortisol Test, Perceived Stress Scale (PSS)."
        },
        sleep: {
            keywords: ['sleep', 'insomnia', 'rest', 'tired'],
            definition: "Vital for recovery. Poor sleep increases risks of heart disease, obesity, and depression.",
            improvement: "Stick to a schedule, avoid screens before bed (blue light), and keep the room cool and dark.",
            tests: "Polysomnography (Sleep Study)."
        },
        liver: {
            keywords: ['liver', 'bilirubin', 'jaundice', 'enzyme', 'sgot', 'sgpt', 'alt', 'ast'],
            definition: "The liver filters blood and detoxifies chemicals. Enzymes like ALT/AST spill into blood when liver is damaged.",
            improvement: "Avoid alcohol, limit tylenol/medications processed by liver, maintain healthy weight to prevent fatty liver.",
            tests: "Liver Function Test (LFT), Ultrasound, FibroScan."
        }
    };

    const [lastTopic, setLastTopic] = useState(null); // Context memory

    const generateResponse = (query) => {
        const q = query.toLowerCase();

        // 1. Context Resolution (Handle "it", "that", "improve")
        let activeTopic = null;

        // Check for specific topic keywords in current query
        for (const [key, data] of Object.entries(knowledgeBase)) {
            if (data.keywords.some(k => q.includes(k))) {
                activeTopic = key;
                setLastTopic(key); // Update context
                break;
            }
        }

        // If no new topic found, use last context for "that/it/improve" queries
        if (!activeTopic && lastTopic && (q.includes('that') || q.includes('it') || q.includes('this') || q.includes('improve') || q.includes('diet') || q.includes('food'))) {
            activeTopic = lastTopic;
        }

        // 2. Direct Data Context Checks (Specific Overrides)
        if ((q.includes('my') || q.includes('score')) && (q.includes('glucose') || q.includes('sugar'))) {
            // ... existing logic ...
            if (diabetesData.glucose > 140) return `Your glucose of ${diabetesData.glucose} mg/dL is high. Consult a doctor.`;
            return `Your glucose (${diabetesData.glucose}) is normal.`;
        }

        // 3. Knowledge Base Response
        if (activeTopic) {
            const data = knowledgeBase[activeTopic];

            // Determine Intent
            if (q.includes('food') || q.includes('eat') || q.includes('diet') || q.includes('lower') || q.includes('improve') || q.includes('advice')) {
                return `🍎 **Diet & Advice for ${activeTopic.charAt(0).toUpperCase() + activeTopic.slice(1)}:** ${data.improvement}`;
            }
            if (q.includes('test') || q.includes('check') || q.includes('monitor')) {
                return `🩺 **Tests for ${activeTopic.charAt(0).toUpperCase() + activeTopic.slice(1)}:** ${data.tests}`;
            }
            // Default Definition
            return `**${activeTopic.charAt(0).toUpperCase() + activeTopic.slice(1)}:** ${data.definition}\n\n💡 *Tip: Ask about 'foods' or 'tests' for this.*`;
        }

        // 4. Fallback
        if (q.includes('risk') || q.includes('score')) {
            return "Your scores are calculated using a Random Forest model trained on the Kaggle health dataset.";
        }

        return "I can explain any input field (Glucose, BP, BMI, Liver Enzymes, Stress, etc.). Try asking: 'What foods lower BP?' or 'What is Bilirubin?'";
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 bg-white/80 backdrop-blur-2xl border border-cyan-100 rounded-3xl shadow-[0_20px_60px_rgba(0,139,139,0.15)] overflow-hidden animate-scale-in origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">SilentRisk AI</h3>
                                <p className="text-cyan-100 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span> Context Active
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-96 overflow-y-auto p-5 space-y-4 bg-slate-50/80">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-tr-sm'
                                    : 'bg-white text-slate-600 border border-slate-200/50 rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-3 bg-slate-100/80 rounded-2xl px-5 py-3 border border-slate-200 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.1)] transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your health analysis query..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium"
                            />
                            <button
                                onClick={handleSend}
                                className="text-cyan-600 hover:text-cyan-700 disabled:opacity-50 transition-transform hover:scale-110 active:scale-95"
                                disabled={!inputValue.trim()}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button aligned with Figma style */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-3xl shadow-[0_8px_30px_rgba(6,182,212,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 group ${isOpen ? 'bg-slate-900 rotate-90 rounded-full' : 'bg-gradient-to-br from-cyan-400 to-teal-600 animate-float-slow'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-cyan-500 rounded-full"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default HealthChatbot;
