import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { FlaskConical, Database, Split, Sigma } from 'lucide-react';
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
    const z = 5 - (attendance * 0.08) - (grades * 0.05);
    const logisticProb = 1 / (1 + Math.exp(-z)); 
    const logisticRisk = logisticProb * 100;

    let rfRisk = 0;
    if (attendance < 60) {
        rfRisk = 90 + (Math.random() * 5); 
    } 
    else if (attendance >= 60 && grades < 50) {
        rfRisk = 65 + (80 - attendance) * 0.5;
    }
    else {
        rfRisk = 10 + (100 - attendance) * 0.2 + (100 - grades) * 0.2;
    }

    const calculatedRisk = modelType === 'logistic' ? logisticRisk : rfRisk;
    const clampedRisk = Math.min(Math.max(calculatedRisk, 1), 99);
    setRisk(Math.round(clampedRisk));

    const baseline = 45; // Average risk in dataset
    const diff = clampedRisk - baseline;
    
    if (viewType === 'shap') {
        let attContrib, gradesContrib;

        if (modelType === 'rf') {
            if (attendance < 60) {
                attContrib = diff * 0.9;
                gradesContrib = diff * 0.1;
            } else {
                attContrib = diff * 0.4;
                gradesContrib = diff * 0.6;
            }
        } else {
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
        setShapValues([
            { name: 'S-101', logistic: 12, rf: 5, note: 'Complex case' }, 
            { name: 'S-102', logistic: 8, rf: 6, note: 'Avg case' },
            { name: 'S-103', logistic: 15, rf: 4, note: 'Outlier' }, 
            { name: 'S-104', logistic: 5, rf: 7, note: 'Linear case' },  
            { name: 'S-105', logistic: 10, rf: 3, note: 'High variance' },
        ]);
    }

  }, [attendance, grades, modelType, viewType]);

  return (
    <div className="bg-[#0b101a] rounded-xl border border-white/5 p-4 md:p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 gap-4">
            <div>
                <h2 className="text-xl font-bold text-fuchsia-400 flex items-center gap-2 neon-text-purple">
                    <FlaskConical size={20} />
                    XAI Lab: Model Comparison
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Inference simulation: <strong className="text-slate-200">Linear vs Non-Linear</strong> boundaries.
                </p>
            </div>
            
            <div className="flex bg-[#0f172a] rounded-lg p-1 border border-white/10 w-full md:w-auto">
                <button 
                    onClick={() => setModelType('rf')}
                    className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-bold rounded transition-colors ${modelType === 'rf' ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_-2px_rgba(192,38,211,0.5)]' : 'text-slate-400 hover:text-white'}`}
                >
                    Random Forest
                </button>
                <button 
                    onClick={() => setModelType('logistic')}
                    className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-bold rounded transition-colors ${modelType === 'logistic' ? 'bg-pink-600 text-white shadow-[0_0_10px_-2px_rgba(219,39,119,0.5)]' : 'text-slate-400 hover:text-white'}`}
                >
                    Logistic Reg.
                </button>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Database size={14} className="text-fuchsia-400"/> Feature Vectors
                            <InfoTooltip text="Input variables simulating a student profile." />
                        </h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Attendance Rate</label>
                                <span className="text-xs font-mono text-fuchsia-300 bg-fuchsia-900/20 px-2 rounded border border-fuchsia-500/20">{attendance}%</span>
                            </div>
                            <input 
                                type="range" min="40" max="100" value={attendance} 
                                onChange={(e) => setAttendance(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Avg Grades</label>
                                <span className="text-xs font-mono text-pink-300 bg-pink-900/20 px-2 rounded border border-pink-500/20">{grades}</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" value={grades} 
                                onChange={(e) => setGrades(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-lg border transition-colors duration-300 flex justify-between items-center ${risk > 50 ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                    <div>
                        <div className="text-xs uppercase tracking-wider mb-1 text-slate-400 font-semibold flex items-center gap-1">
                             Predicted Dropout Risk
                             <InfoTooltip text={modelType === 'rf' ? 'RF Model Logic: If Attendance < 60%, risk skyrockets (non-linear jump).' : 'Logistic Logic: Risk increases smoothly as inputs decrease (linear correlation).'} />
                        </div>
                        <div className="text-xs mt-1 text-slate-500">
                             Classifier: <span className="font-mono text-slate-300">{modelType === 'rf' ? 'RandomForest' : 'LogisticReg'}</span>
                        </div>
                    </div>
                    <div className={`text-5xl font-extrabold ${risk > 50 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}>
                        {risk}%
                    </div>
                </div>
            </div>

            {/* Explanation Chart */}
            <div className="h-80 bg-[#0f172a]/30 rounded-lg p-4 border border-white/5 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        {viewType === 'shap' ? 'SHAP Explainer (Local)' : 'DALEX Residuals (Global)'}
                        <InfoTooltip text={viewType === 'shap' ? 'SHAP: Game theory approach to explain output of any machine learning model.' : 'DALEX: Analyzes model performance errors (residuals) across a dataset.'} />
                    </h3>
                    <div className="flex gap-1 bg-slate-900 rounded p-1 border border-white/5">
                        <button onClick={() => setViewType('shap')} title="Switch to SHAP View" className={`p-1.5 rounded ${viewType === 'shap' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Split size={14}/></button>
                        <button onClick={() => setViewType('dalex')} title="Switch to DALEX View" className={`p-1.5 rounded ${viewType === 'dalex' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Sigma size={14}/></button>
                    </div>
                </div>

                <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        {viewType === 'shap' ? (
                            <BarChart layout="vertical" data={shapValues} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                                <XAxis type="number" stroke="#64748b" fontSize={10} hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={70} fontSize={10} tick={{fill: '#cbd5e1'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {shapValues.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Baseline' ? '#475569' : entry.value > 0 ? '#ec4899' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <LineChart data={shapValues}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" fontSize={10} stroke="#64748b" />
                                <YAxis fontSize={10} stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                                <Line type="monotone" dataKey="logistic" stroke="#f472b6" strokeWidth={2} name="Logistic" dot={{r: 4}} />
                                <Line type="monotone" dataKey="rf" stroke="#34d399" strokeWidth={2} name="Random Forest" dot={{r: 4}} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="mt-6 p-3 bg-fuchsia-900/10 border border-fuchsia-500/20 rounded-lg text-xs text-fuchsia-200 flex gap-3">
            <div className="mt-0.5">💡</div>
            <div className="leading-relaxed">
            <strong>XAI Insight:</strong> 
            {viewType === 'shap' 
                ? " The SHAP waterfall chart visualizes how Attendance and Grades push the Risk % away from the global average (Baseline). Notice how RF reacts sharply to low attendance."
                : " DALEX shows that Random Forest (Green) maintains lower error rates on outliers compared to Logistic Regression (Pink), proving its resilience on complex data."
            }
            </div>
        </div>
    </div>
  );
};
export default XAIWidget;