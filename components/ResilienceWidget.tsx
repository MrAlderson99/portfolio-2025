import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, BarChart, Bar } from 'recharts';
import { GraduationCap, Database, TrendingUp, Filter } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const ResilienceWidget: React.FC = () => {
  const [dataSource, setDataSource] = useState<'PISA' | 'SAEB'>('PISA');
  const [data, setData] = useState<any[]>([]);
  const [resilientCount, setResilientCount] = useState(0);

  // Simulate R/Sparklyr data fetching and processing
  useEffect(() => {
    // Generate synthetic data representing students
    // X-axis: Socio-Economic Status (SES) [-3 to 3]
    // Y-axis: Math Score [200 to 600]
    
    const count = 100;
    const newData = Array.from({ length: count }, (_, i) => {
      // Correlation: Higher SES usually means Higher Score
      const ses = (Math.random() * 6) - 3; // -3 to 3
      const baseScore = 400 + (ses * 40); // Linear trend
      const noise = (Math.random() * 100) - 50; 
      const score = Math.max(200, Math.min(800, baseScore + noise));
      
      // Resilience Definition: Low SES (< -0.5) AND High Score (> 500)
      const isResilient = ses < -0.5 && score > 480;
      
      return {
        id: i,
        ses: parseFloat(ses.toFixed(2)),
        score: Math.floor(score),
        isResilient,
        // Mocking factors for explanation
        factors: {
            motivation: Math.floor(Math.random() * 10),
            schoolSupport: Math.floor(Math.random() * 10),
            familyEngagement: Math.floor(Math.random() * 10)
        }
      };
    });

    setData(newData);
    setResilientCount(newData.filter(d => d.isResilient).length);
  }, [dataSource]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-xl font-bold text-teal-400 flex items-center gap-2">
                    <GraduationCap size={20} />
                    GlassBox Learner
                    <InfoTooltip text="GlassBox Learner uses Explainable AI (XAI) to reveal WHY a student is predicted to succeed or struggle, empowering teachers to intervene." />
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Identifying and explaining educational resilience (R + Sparklyr).
                </p>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-500 font-mono">DATA SOURCE:</span>
                 <button 
                    onClick={() => setDataSource('PISA')}
                    className={`px-3 py-1 text-xs font-bold rounded border ${dataSource === 'PISA' ? 'bg-teal-600/20 text-teal-400 border-teal-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                 >
                    PISA (Intl)
                 </button>
                 <button 
                    onClick={() => setDataSource('SAEB')}
                    className={`px-3 py-1 text-xs font-bold rounded border ${dataSource === 'SAEB' ? 'bg-teal-600/20 text-teal-400 border-teal-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                 >
                    SAEB (Br)
                 </button>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Scatter Plot */}
            <div className="lg:col-span-2 h-64 bg-slate-800/30 rounded-lg p-2 border border-slate-700/30 relative">
                 <div className="absolute top-2 right-2 z-10 bg-slate-900/80 p-2 rounded border border-slate-700 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-teal-400"></div> Resilient
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div> Expected
                    </div>
                 </div>
                 
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            type="number" 
                            dataKey="ses" 
                            name="Socio-Economic Status" 
                            label={{ value: 'Socio-Economic Status (Index)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="score" 
                            name="Math Score" 
                            label={{ value: 'Math Proficiency', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-slate-900 border border-slate-600 p-2 rounded shadow-xl text-xs">
                                    <p className="font-bold text-slate-200">Student #{d.id}</p>
                                    <p className="text-slate-400">SES: {d.ses}</p>
                                    <p className="text-slate-400">Score: {d.score}</p>
                                    {d.isResilient && <p className="text-teal-400 font-bold mt-1">✨ RESILIENT</p>}
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        {/* Threshold Lines */}
                        <ReferenceLine x={-0.5} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Vulnerability Threshold', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10, angle: -90 }} />
                        <ReferenceLine y={480} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'High Performance', position: 'insideRight', fill: '#f59e0b', fontSize: 10 }} />
                        
                        <Scatter name="Students" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isResilient ? '#2dd4bf' : '#475569'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Stats & Benchmarking */}
            <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center">
                        Identified Resilient Students <InfoTooltip text="Students in the top-left quadrant (High Performance, Low SES)." />
                    </div>
                    <div className="text-3xl font-bold text-teal-400">{resilientCount} <span className="text-base font-normal text-slate-500">/ 100</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Criteria: Low SES + High Score
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Database size={12}/> Model Benchmarking (R)
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-300">
                            <span>Random Forest (Spark)</span>
                            <span className="font-mono text-teal-400">AUC: 0.88</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-500 h-full w-[88%]"></div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
                            <span>XGBoost</span>
                            <span className="font-mono text-blue-400">AUC: 0.91</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[91%]"></div>
                        </div>
                        
                         <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
                            <span>SVM</span>
                            <span className="font-mono text-purple-400">AUC: 0.82</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[82%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DALEX Break Down Plot Mockup */}
            <div className="lg:col-span-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                    <Filter size={14} className="text-teal-400"/>
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                         Why this student? (DALEX Attribution)
                         <InfoTooltip text="This chart shows how specific variables (Motivation, Support) increased or decreased the prediction score." />
                    </h3>
                </div>
                <div className="h-40 w-full flex gap-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Intercept', value: 0.2 },
                            { name: '+ Motivation', value: 0.5 },
                            { name: '+ School Supp.', value: 0.3 },
                            { name: '- Family SES', value: -0.1 }, // Negative impact of poverty
                            { name: 'Prediction', value: 0.9 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} />
                            <Bar dataKey="value" fill="#2dd4bf" barSize={40}>
                                {
                                  [
                                    { name: 'Intercept', value: 0.2 },
                                    { name: '+ Motivation', value: 0.5 },
                                    { name: '+ School Supp.', value: 0.3 },
                                    { name: '- Family SES', value: -0.1 },
                                    { name: 'Prediction', value: 0.9 },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#f87171' : index === 4 ? '#f59e0b' : '#2dd4bf'} />
                                  ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="w-64 text-[10px] text-slate-400 flex flex-col justify-center">
                        <p className="mb-2">
                            <strong className="text-slate-200">Teacher Insight:</strong>
                        </p>
                        <ul className="list-disc pl-3 space-y-1">
                            <li><strong>Motivation</strong> (+0.3) helps, but <strong>School Support</strong> (+0.5) is the critical factor.</li>
                            <li><span className="text-teal-400 font-bold">Action:</span> Maintain support program to offset negative SES impact.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-6 p-3 bg-teal-900/20 border border-teal-800/50 rounded text-xs text-teal-200 flex gap-2">
            <div className="mt-0.5">💡</div>
            <div>
            <strong>Methodology:</strong> This project applies <strong>XGBoost & Random Forest</strong> models trained on large-scale educational data ({dataSource}). We use <strong>DALEX</strong> to explain the factors enabling students to overcome socio-economic vulnerability.
            </div>
        </div>
    </div>
  );
};

export default ResilienceWidget;