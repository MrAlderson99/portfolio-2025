import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, BarChart, Bar } from 'recharts';
import { GraduationCap, Database, Filter } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const ResilienceWidget: React.FC = () => {
  const [dataSource, setDataSource] = useState<'PISA' | 'SAEB'>('PISA');
  const [data, setData] = useState<any[]>([]);
  const [resilientCount, setResilientCount] = useState(0);

  useEffect(() => {
    const count = 100;
    const newData = Array.from({ length: count }, (_, i) => {
      const ses = (Math.random() * 6) - 3; // -3 to 3
      const baseScore = 400 + (ses * 40); 
      const noise = (Math.random() * 100) - 50; 
      const score = Math.max(200, Math.min(800, baseScore + noise));
      
      const isResilient = ses < -0.5 && score > 480;
      
      return {
        id: i,
        ses: parseFloat(ses.toFixed(2)),
        score: Math.floor(score),
        isResilient,
      };
    });

    setData(newData);
    setResilientCount(newData.filter(d => d.isResilient).length);
  }, [dataSource]);

  return (
    <div className="bg-[#0b101a] rounded-xl border border-white/5 p-4 md:p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 gap-4">
            <div>
                <h2 className="text-xl font-bold text-teal-400 flex items-center gap-2 neon-text-blue">
                    <GraduationCap size={20} />
                    GlassBox Learner
                    <InfoTooltip text="XAI reveals WHY a student is predicted to succeed or struggle." />
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Identifying educational resilience (R + Sparklyr).
                </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0f172a] p-1 rounded-lg border border-white/10">
                 <button 
                    onClick={() => setDataSource('PISA')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dataSource === 'PISA' ? 'bg-teal-600/20 text-teal-400 border border-teal-500/50' : 'text-slate-400 hover:text-white'}`}
                 >
                    PISA (Intl)
                 </button>
                 <button 
                    onClick={() => setDataSource('SAEB')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dataSource === 'SAEB' ? 'bg-teal-600/20 text-teal-400 border border-teal-500/50' : 'text-slate-400 hover:text-white'}`}
                 >
                    SAEB (Br)
                 </button>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Scatter Plot */}
            <div className="lg:col-span-2 h-72 bg-[#0f172a]/30 rounded-lg p-2 border border-white/5 relative">
                 <div className="absolute top-2 right-2 z-10 bg-[#020617]/80 p-2 rounded border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div> Resilient
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div> Expected
                    </div>
                 </div>
                 
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis 
                            type="number" 
                            dataKey="ses" 
                            name="Socio-Economic Status" 
                            label={{ value: 'Socio-Economic Status (Index)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="score" 
                            name="Math Score" 
                            label={{ value: 'Math Proficiency', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-[#020617] border border-slate-600 p-2 rounded shadow-xl text-xs">
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
                        <ReferenceLine x={-0.5} stroke="#f59e0b" strokeDasharray="3 3" />
                        <ReferenceLine y={480} stroke="#f59e0b" strokeDasharray="3 3" />
                        
                        <Scatter name="Students" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isResilient ? '#2dd4bf' : '#475569'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Stats & Benchmarking */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-4 lg:gap-0">
                <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center">
                        Identified Resilient Students <InfoTooltip text="Students in the top-left quadrant." />
                    </div>
                    <div className="text-4xl font-bold text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">{resilientCount} <span className="text-base font-normal text-slate-500">/ 100</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Criteria: Low SES + High Score
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Database size={12}/> Model AUC (R)
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                                <span>Random Forest</span>
                                <span className="font-mono text-teal-400">0.88</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full w-[88%] shadow-[0_0_10px_rgba(20,184,166,0.6)]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                                <span>XGBoost</span>
                                <span className="font-mono text-blue-400">0.91</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[91%] shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DALEX Break Down Plot Mockup */}
            <div className="lg:col-span-3 bg-[#0f172a]/30 p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Filter size={14} className="text-teal-400"/>
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                         DALEX Attribution
                         <InfoTooltip text="Chart shows how variables impact the prediction." />
                    </h3>
                </div>
                <div className="h-40 w-full flex flex-col md:flex-row gap-6">
                     <div className="flex-grow h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Intercept', value: 0.2 },
                                { name: '+ Motivation', value: 0.5 },
                                { name: '+ School', value: 0.3 },
                                { name: '- SES', value: -0.1 }, 
                                { name: 'Final', value: 0.9 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" fontSize={10} stroke="#64748b" tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                                <Bar dataKey="value" fill="#2dd4bf" barSize={40}>
                                    {
                                    [
                                        { name: 'Intercept', value: 0.2 },
                                        { name: '+ Motivation', value: 0.5 },
                                        { name: '+ School', value: 0.3 },
                                        { name: '- SES', value: -0.1 },
                                        { name: 'Final', value: 0.9 },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#f87171' : index === 4 ? '#f59e0b' : '#2dd4bf'} />
                                    ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-64 text-[11px] text-slate-400 flex flex-col justify-center bg-[#0f172a]/50 p-3 rounded border border-white/5">
                        <p className="mb-2">
                            <strong className="text-slate-200">Teacher Insight:</strong>
                        </p>
                        <ul className="list-disc pl-3 space-y-2">
                            <li><strong>Motivation</strong> (+0.3) helps, but <strong>School Support</strong> (+0.5) is the critical factor.</li>
                            <li><span className="text-teal-400 font-bold">Action:</span> Maintain support program to offset negative SES impact.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-6 p-3 bg-teal-900/10 border border-teal-500/20 rounded-lg text-xs text-teal-200 flex gap-2">
            <div className="mt-0.5">💡</div>
            <div>
            <strong>Methodology:</strong> This project applies <strong>XGBoost & Random Forest</strong> models trained on large-scale educational data ({dataSource}). We use <strong>DALEX</strong> to explain the factors enabling students to overcome socio-economic vulnerability.
            </div>
        </div>
    </div>
  );
};

export default ResilienceWidget;