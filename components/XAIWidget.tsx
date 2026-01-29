import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { Brain, Search, School, Split, Sigma, FlaskConical, Database } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const XAIWidget: React.FC = () => {
  const [attendance, setAttendance] = useState(85);
  const [grades, setGrades] = useState(75);
  const [risk, setRisk] = useState(0);
  const [shapValues, setShapValues] = useState<any[]>([]);
  const [modelType, setModelType] = useState<'rf' | 'logistic'>('rf');
  const [viewType, setViewType] = useState<'shap' | 'dalex'>('shap');

  useEffect(() => {
    // --- Realistic Inference Simulation ---
    
    // 1. Logistic Regression (Linear Model)
    // Sigmoid Function: 1 / (1 + e^-z)
    // z = b0 + b1*Att + b2*Grades
    // Coefficients (Simulated from a 'real' training session on PISA data)
    // Intercept: 5, Att_Coef: -0.08, Grades_Coef: -0.05
    const z = 5 - (attendance * 0.08) - (grades * 0.05);
    const logisticProb = 1 / (1 + Math.exp(-z)); 
    const logisticRisk = logisticProb * 100;

    // 2. Random Forest (Non-Linear Model)
    // Simulating a decision tree path logic
    let rfRisk = 0;
    // Decision Tree Path 1: Chronic Absenteeism overrides everything
    if (attendance < 60) {
        rfRisk = 90 + (Math.random() * 5); 
    } 
    // Decision Tree Path 2: Good attendance, but failing grades
    else if (attendance >= 60 && grades < 50) {
        rfRisk = 65 + (80 - attendance) * 0.5;
    }
    // Decision Tree Path 3: Good student
    else {
        rfRisk = 10 + (100 - attendance) * 0.2 + (100 - grades) * 0.2;
    }

    const calculatedRisk = modelType === 'logistic' ? logisticRisk : rfRisk;
    // Clamp
    const clampedRisk = Math.min(Math.max(calculatedRisk, 1), 99);
    setRisk(Math.round(clampedRisk));

    // --- Explanation Generation (SHAP) ---
    // SHAP = Feature Contribution to the deviation from Baseline Prediction
    const baseline = 45; // Average risk in dataset
    const diff = clampedRisk - baseline;
    
    if (viewType === 'shap') {
        // Distribute the 'diff' based on model architecture characteristics
        let attContrib, gradesContrib;

        if (modelType === 'rf') {
            // RF values extreme features more heavily (non-linear steps)
            if (attendance < 60) {
                attContrib = diff * 0.9; // Almost all risk comes from attendance
                gradesContrib = diff * 0.1;
            } else {
                attContrib = diff * 0.4;
                gradesContrib = diff * 0.6;
            }
        } else {
             // Logistic distributes proportional to coefficients magnitude
             // Att Coef (-0.08) is stronger than Grades (-0.05)
             const totalCoef = 0.08 + 0.05;
             attContrib = diff * (0.08 / totalCoef);
             gradesContrib = diff * (0.05 / totalCoef);
        }

        setShapValues([
            { name: 'Attendance', value: parseFloat(attContrib.toFixed(1)) },
            { name: 'Grades', value: parseFloat(gradesContrib.toFixed(1)) },
            { name: 'Baseline', value: baseline }
        ]);
    } else {
        // DALEX Residuals (Simulating Error on a Test Set)
        // RF generally has lower residuals on complex data points
        setShapValues([
            { name: 'Student 101', logistic: 12, rf: 5, note: 'Complex case' }, 
            { name: 'Student 102', logistic: 8, rf: 6, note: 'Avg case' },
            { name: 'Student 103', logistic: 15, rf: 4, note: 'Outlier' }, 
            { name: 'Student 104', logistic: 5, rf: 7, note: 'Linear case' },  
            { name: 'Student 105', logistic: 10, rf: 3, note: 'High variance' },
        ]);
    }

  }, [attendance, grades, modelType, viewType]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                    <FlaskConical size={20} />
                    XAI Lab: Model Comparison
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Real-time inference simulation: <strong className="text-slate-200">Linear vs Non-Linear</strong> decision boundaries.
                </p>
            </div>
            
            <div className="flex flex-col gap-2 align-end">
                {/* Model Selector */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button 
                        onClick={() => setModelType('rf')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${modelType === 'rf' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Random Forest: Uses multiple decision trees. Better for complex, non-linear patterns."
                    >
                        Random Forest
                    </button>
                    <button 
                        onClick={() => setModelType('logistic')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${modelType === 'logistic' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Logistic Regression: Uses a linear equation + sigmoid function. Simple but limited."
                    >
                        Logistic Reg.
                    </button>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Database size={14}/> Feature Vectors
                            <InfoTooltip text="Input variables simulating a student profile." />
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-slate-400">Attendance Rate</label>
                                <span className="text-xs font-mono text-purple-300">{attendance}%</span>
                            </div>
                            <input 
                                type="range" min="40" max="100" value={attendance} 
                                onChange={(e) => setAttendance(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-slate-400">Avg Grades</label>
                                <span className="text-xs font-mono text-purple-300">{grades}</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" value={grades} 
                                onChange={(e) => setGrades(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors duration-300 flex justify-between items-center ${risk > 50 ? 'bg-red-900/20 border-red-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                    <div>
                        <div className="text-xs uppercase tracking-wider mb-1 text-slate-400 font-semibold flex items-center gap-1">
                             Predicted Dropout Risk
                             <InfoTooltip text={modelType === 'rf' ? 'RF Model Logic: If Attendance < 60%, risk skyrockets (non-linear jump).' : 'Logistic Logic: Risk increases smoothly as inputs decrease (linear correlation).'} />
                        </div>
                        <div className="text-xs mt-1 text-slate-400">
                             Model: <span className="font-mono text-white">{modelType === 'rf' ? 'RandomForestClassifier' : 'LogisticRegression'}</span>
                        </div>
                    </div>
                    <div className={`text-4xl font-bold ${risk > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {risk}%
                    </div>
                </div>
            </div>

            {/* Explanation Chart */}
            <div className="h-64 bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        {viewType === 'shap' ? 'SHAP Explainer (Local)' : 'DALEX Residuals (Global)'}
                        <InfoTooltip text={viewType === 'shap' ? 'SHAP (SHapley Additive exPlanations): Game theory approach to explain output of any machine learning model.' : 'DALEX (Descriptive mAchine Learning EXplanations): Analyzes model performance errors (residuals) across a dataset.'} />
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setViewType('shap')} title="Switch to SHAP View" className={`p-1 rounded ${viewType === 'shap' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}><Split size={14}/></button>
                        <button onClick={() => setViewType('dalex')} title="Switch to DALEX View" className={`p-1 rounded ${viewType === 'dalex' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}><Sigma size={14}/></button>
                    </div>
                </div>

                <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        {viewType === 'shap' ? (
                            <BarChart layout="vertical" data={shapValues} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={70} fontSize={10} tick={{fill: '#cbd5e1'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {shapValues.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Baseline' ? '#64748b' : entry.value > 0 ? '#f87171' : '#34d399'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <LineChart data={shapValues}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                                <YAxis fontSize={10} stroke="#94a3b8" label={{ value: 'Error Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}/>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                                <Line type="monotone" dataKey="logistic" stroke="#f472b6" strokeWidth={2} name="Logistic (Linear)" dot={{r: 4}} />
                                <Line type="monotone" dataKey="rf" stroke="#34d399" strokeWidth={2} name="Random Forest" dot={{r: 4}} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="mt-6 p-3 bg-purple-900/20 border border-purple-800/50 rounded text-xs text-purple-200 flex gap-2">
            <div className="mt-0.5">💡</div>
            <div>
            <strong>XAI Insight:</strong> 
            {viewType === 'shap' 
                ? " SHAP waterfall chart visualizes how Attendance and Grades push the Risk % away from the global average (Baseline)."
                : " DALEX shows that Random Forest (Green) maintains lower error rates on outliers compared to Logistic Regression (Pink)."
            }
            </div>
        </div>
    </div>
  );
};
export default XAIWidget;