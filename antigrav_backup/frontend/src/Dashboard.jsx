import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import RiskCard from './RiskCard';
import Recommendations from './Recommendations';

const Dashboard = () => {
    const [healthData, setHealthData] = useState({
        age: 45,
        bmi: 24,
        systolicBP: 120,
        diastolicBP: 80,
        cholesterol: 180,
        activityLevel: 3,
        isSmoker: false,
        isDiabetic: false
    });

    const [riskAnalysis, setRiskAnalysis] = useState({
        cardioScore: 0,
        metabolicScore: 0,
        overallRisk: 'low',
        recommendations: []
    });

    useEffect(() => {
        calculateRisk();
    }, [healthData]);

    const calculateRisk = () => {
        let cardioScore = 0;
        let metabolicScore = 0;
        const recs = [];

        // Cardio Risk Calculation (Simplified)
        // Base score from Age
        cardioScore += (healthData.age / 100) * 20;

        // BP Impact
        if (healthData.systolicBP > 120) cardioScore += (healthData.systolicBP - 120) * 0.5;
        if (healthData.diastolicBP > 80) cardioScore += (healthData.diastolicBP - 80) * 0.5;

        // Cholesterol Impact
        if (healthData.cholesterol > 200) cardioScore += (healthData.cholesterol - 200) * 0.2;

        // Smoking Impact
        if (healthData.isSmoker) cardioScore += 25;

        // Metabolic Risk Calculation
        // BMI Impact
        if (healthData.bmi > 25) metabolicScore += (healthData.bmi - 25) * 2;

        // Diabetes Impact
        if (healthData.isDiabetic) metabolicScore += 30;

        // Activity Impact (Inverse)
        metabolicScore += Math.max(0, 20 - (healthData.activityLevel * 2));

        // Normalize Scores to 0-100 range roughly
        cardioScore = Math.min(100, Math.round(cardioScore));
        metabolicScore = Math.min(100, Math.round(metabolicScore));

        // Determine overall risk level
        const maxScore = Math.max(cardioScore, metabolicScore);
        let overallRisk = 'low';
        if (maxScore > 70) overallRisk = 'high';
        else if (maxScore > 40) overallRisk = 'moderate';

        // Generate Recommendations
        if (healthData.systolicBP > 130 || healthData.diastolicBP > 85) {
            recs.push({
                title: 'Hypertension Alert',
                recommendation: 'Your blood pressure is elevated. Consider reducing sodium intake and managing stress levels alongside regular monitoring.',
                severity: healthData.systolicBP > 140 ? 'high' : 'moderate',
                tags: ['Diet', 'Lifestyle']
            });
        }

        if (healthData.bmi > 30) {
            recs.push({
                title: 'Weight Management',
                recommendation: 'BMI indicates obesity range. A structured diet and exercise plan is recommended to lower metabolic risk.',
                severity: 'high',
                tags: ['Diet', 'Exercise']
            });
        } else if (healthData.bmi > 25) {
            recs.push({
                title: 'Weight Check',
                recommendation: 'BMI is slightly above optimal range. Increasing daily activity could help normalize this.',
                severity: 'moderate',
                tags: ['Exercise']
            });
        }

        if (healthData.isSmoker) {
            recs.push({
                title: 'Smoking Cessation',
                recommendation: 'Smoking is the single largest preventable risk factor. Immediate cessation will drastically lower cardiovascular risk.',
                severity: 'high',
                tags: ['Lifestyle', 'Urgent']
            });
        }

        if (healthData.activityLevel < 3) {
            recs.push({
                title: 'Sedentary Lifestyle',
                recommendation: 'Activity levels are low. Aim for at least 150 minutes of moderate activity per week.',
                severity: 'moderate',
                tags: ['Exercise']
            });
        }

        setRiskAnalysis({
            cardioScore,
            metabolicScore,
            overallRisk,
            recommendations: recs
        });
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar healthData={healthData} setHealthData={setHealthData} />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-8">

                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Patient Risk Assessment</h1>
                            <p className="text-slate-500 mt-1">Real-time analysis based on current vitals</p>
                        </div>

                        <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${riskAnalysis.overallRisk === 'high' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                riskAnalysis.overallRisk === 'moderate' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                    'bg-emerald-50 border-emerald-100 text-emerald-700'
                            }`}>
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${riskAnalysis.overallRisk === 'high' ? 'bg-rose-400' :
                                        riskAnalysis.overallRisk === 'moderate' ? 'bg-amber-400' :
                                            'bg-emerald-400'
                                    }`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${riskAnalysis.overallRisk === 'high' ? 'bg-rose-500' :
                                        riskAnalysis.overallRisk === 'moderate' ? 'bg-amber-500' :
                                            'bg-emerald-500'
                                    }`}></span>
                            </span>
                            <span className="font-semibold capitalize">{riskAnalysis.overallRisk} Risk Profile</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <RiskCard
                            label="Cardiovascular Risk Score"
                            score={riskAnalysis.cardioScore}
                            max={100}
                            unit="/ 100"
                            riskLevel={riskAnalysis.cardioScore > 60 ? 'high' : riskAnalysis.cardioScore > 30 ? 'moderate' : 'low'}
                        />
                        <RiskCard
                            label="Metabolic Risk Score"
                            score={riskAnalysis.metabolicScore}
                            max={100}
                            unit="/ 100"
                            riskLevel={riskAnalysis.metabolicScore > 60 ? 'high' : riskAnalysis.metabolicScore > 30 ? 'moderate' : 'low'}
                        />
                    </div>

                    <Recommendations riskFactors={riskAnalysis.recommendations} />

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
