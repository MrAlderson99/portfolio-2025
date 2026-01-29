import React, { useState, useEffect, useMemo } from 'react';
import { 
  ListTodo, 
  MapPin, 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  Zap, 
  Clock, 
  ArrowUp, 
  Smartphone, 
  Briefcase, 
  Home, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface Task {
  id: number;
  title: string;
  context: 'Office' | 'Home' | 'Errands';
  energy: 'High' | 'Medium' | 'Low';
  effort: number; // minutes
  deadline: number; // days remaining
  isQuickWin?: boolean;
}

const TaskmasterWidget: React.FC = () => {
  const [userEnergy, setUserEnergy] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [userLocation, setUserLocation] = useState<'Office' | 'Home' | 'On the Go'>('Office');
  const [calendarGap, setCalendarGap] = useState<number | null>(null); // Minutes available

  // Mock Data
  const tasks: Task[] = [
    { id: 1, title: 'Deep Work: API Architecture', context: 'Office', energy: 'High', effort: 120, deadline: 2 },
    { id: 2, title: 'Review PRs', context: 'Office', energy: 'Medium', effort: 30, deadline: 1 },
    { id: 3, title: 'Call Vendor', context: 'Errands', energy: 'Low', effort: 10, deadline: 0, isQuickWin: true },
    { id: 4, title: 'Buy Groceries', context: 'Errands', energy: 'Medium', effort: 45, deadline: 3 },
    { id: 5, title: 'Write Blog Post', context: 'Home', energy: 'High', effort: 90, deadline: 5 },
    { id: 6, title: 'Pay Bills', context: 'Home', energy: 'Low', effort: 15, deadline: 2, isQuickWin: true },
    { id: 7, title: 'Team Sync', context: 'Office', energy: 'Medium', effort: 60, deadline: 0 },
  ];

  // Feature 1 & 2: Dynamic Prioritization Algorithm
  const sortedTasks = useMemo(() => {
    return [...tasks].map(task => {
      let score = 0;
      
      // 1. Context Match (The "Gatekeeper")
      // If I'm at Office, Home tasks are demoted heavily
      if (userLocation === 'Office' && task.context === 'Office') score += 1000;
      else if (userLocation === 'Home' && task.context === 'Home') score += 1000;
      else if (userLocation === 'On the Go' && task.context === 'Errands') score += 1000;
      else score -= 500; // Wrong context

      // 2. Energy Match (The "Productivity Hack")
      // High Energy user should do High Energy tasks
      if (userEnergy === task.energy) score += 200;
      else if (userEnergy === 'High' && task.energy === 'Low') score -= 50; // Don't waste energy
      else if (userEnergy === 'Low' && task.energy === 'High') score -= 300; // Impossible to do

      // 3. Deadline Urgency (The "Reality Check")
      score += (10 - task.deadline) * 20;

      return { ...task, score };
    }).sort((a, b) => b.score - a.score);
  }, [userEnergy, userLocation]);

  // Feature 3: Smart Reminders (Calendar Gaps)
  const quickWin = useMemo(() => {
    if (!calendarGap) return null;
    // Find highest priority task that fits in the gap
    return sortedTasks.find(t => t.effort <= calendarGap && t.score > 0);
  }, [calendarGap, sortedTasks]);

  // Simulate Calendar API Check
  const checkCalendar = () => {
    const gaps = [15, 30, 0];
    const randomGap = gaps[Math.floor(Math.random() * gaps.length)];
    setCalendarGap(randomGap);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
            <ListTodo size={20} />
            The Contextual Taskmaster
            <InfoTooltip text="Demonstrates 3 key products: Context Awareness, Energy Budgeting, and Smart Gap Detection." />
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Reordering your life based on where you are and how you feel.
          </p>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={checkCalendar}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium transition-colors"
             >
                <Calendar size={14} /> Simulate Calendar API
             </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="space-y-6">
            
            {/* Context Simulator */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} /> GPS Context
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {['Office', 'Home', 'On the Go'].map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setUserLocation(loc as any)}
                            className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${userLocation === loc ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                        >
                            <span className="flex items-center gap-2">
                                {loc === 'Office' && <Briefcase size={14}/>}
                                {loc === 'Home' && <Home size={14}/>}
                                {loc === 'On the Go' && <Smartphone size={14}/>}
                                {loc}
                            </span>
                            {userLocation === loc && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Energy Simulator */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Zap size={14} /> Energy Budget
                </h3>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                    <button onClick={() => setUserEnergy('Low')} className={`p-2 rounded ${userEnergy === 'Low' ? 'text-red-400 bg-red-900/20' : 'text-slate-600'}`}><Battery size={20}/></button>
                    <button onClick={() => setUserEnergy('Medium')} className={`p-2 rounded ${userEnergy === 'Medium' ? 'text-yellow-400 bg-yellow-900/20' : 'text-slate-600'}`}><BatteryCharging size={20}/></button>
                    <button onClick={() => setUserEnergy('High')} className={`p-2 rounded ${userEnergy === 'High' ? 'text-emerald-400 bg-emerald-900/20' : 'text-slate-600'}`}><BatteryFull size={20}/></button>
                </div>
                <div className="text-center mt-2 text-xs text-slate-400 font-mono">
                    Current State: <span className="text-white">{userEnergy} Battery</span>
                </div>
            </div>

             {/* Smart Reminder / Quick Win */}
             <div className={`p-4 rounded-lg border transition-all duration-500 ${calendarGap ? 'bg-emerald-900/20 border-emerald-500/50 opacity-100' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
                <h3 className="text-xs font-bold text-emerald-400 uppercase mb-2 flex items-center gap-2">
                    <Clock size={14} /> Smart Gap Detector
                </h3>
                {calendarGap ? (
                    <div>
                        <div className="text-sm text-slate-300 mb-2">
                            Found a <span className="font-bold text-white">{calendarGap} min</span> gap before next meeting.
                        </div>
                        {quickWin ? (
                            <div className="bg-slate-800 p-3 rounded border border-emerald-500/30 flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
                                <div>
                                    <div className="text-sm font-bold text-white">{quickWin.title}</div>
                                    <div className="text-xs text-slate-400">{quickWin.effort} mins • {quickWin.context}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-500 italic">No tasks fit this timeframe. Relax!</div>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-slate-500">Waiting for calendar sync...</div>
                )}
            </div>
        </div>

        {/* Task List Column */}
        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-200">Dynamic Priority Queue</h3>
                <span className="text-xs text-slate-500 font-mono">Algorithm v2.1</span>
            </div>
            
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {sortedTasks.map((task, index) => (
                    <div 
                        key={task.id}
                        className={`relative flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${task.score > 0 ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}
                        style={{ transform: `translateY(${index * 0}px)` }} // Placeholder for framer-motion logic
                    >
                        {index === 0 && task.score > 0 && (
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r"></div>
                        )}
                        
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                                task.energy === 'High' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
                                task.energy === 'Medium' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' :
                                'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
                            }`}>
                                {task.energy[0]}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-200">{task.title}</div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin size={10}/> {task.context}</span>
                                    <span>•</span>
                                    <span>{task.effort} min</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                             <div className="text-xs font-bold text-orange-400 flex items-center justify-end gap-1">
                                {task.score > 0 ? Math.round(task.score) : 'Deprioritized'}
                                {index === 0 && task.score > 0 && <ArrowUp size={12}/>}
                             </div>
                             <div className="text-[10px] text-slate-600">Relevance Score</div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 pt-3 border-t border-slate-700/50 text-[10px] text-slate-500 flex justify-between">
                <span>Sorting Logic: (ContextMatch * 1000) + (EnergyMatch * 200) + (DeadlineUrgency)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskmasterWidget;