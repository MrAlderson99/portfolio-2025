import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Server, 
  Brain, 
  ShieldCheck, 
  Terminal,
  X,
  TrendingUp,
  GraduationCap,
  Cpu,
  Activity,
  Zap
} from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import FleetPulseWidget from './components/FleetPulseWidget';
import XAIWidget from './components/XAIWidget';
import QAWidget from './components/QAWidget';
import DriverEPKWidget from './components/DriverEPKWidget';
import ResilienceWidget from './components/ResilienceWidget';
import CVModal from './components/CVModal';
import { Project } from './types';

// Group 1: Telemetry & Fleet (United)
const telemetryProjects: Project[] = [
  {
    id: 'telemetry-suite',
    title: "Fleet & Safety Intelligence",
    description: "Comprehensive telemetry suite combining 'The Safety Scorecard' (Driver Coaching) and 'FleetPulse' (Operational Analytics). Real-time data processing.",
    tags: ['Telemetry', 'IoT', 'Big Data', 'Driver Scoring', 'Predictive Maint.'],
    link: "https://github.com/lucielton/fleet-pulse",
    icon: <Activity className="text-emerald-400" size={24} />,
    isInteractive: true
  }
];

// Group 2: XAI & Education (United)
const xaiProjects: Project[] = [
  {
    id: 'xai-suite',
    title: "Explainable AI (XAI) Research",
    description: "Interactive research lab comparing Black-box vs Glass-box models. Features 'GlassBox Learner' for resilience and 'XAI Lab' for model comparison.",
    tags: ['XAI', 'SHAP', 'Education', 'Random Forest', 'Research'],
    link: "#",
    icon: <Brain className="text-purple-400" size={24} />,
    isInteractive: true
  }
];

// Group 3: Engineering (QA)
const engProjects: Project[] = [
  {
    id: 'qa-suite',
    title: "Engineering Excellence",
    description: "Automated Quality Assurance Hub. Runs real-time E2E regression tests (simulated Playwright) for Telemetry and XAI pipelines.",
    tags: ['QA', 'CI/CD', 'Automated Testing', 'DevOps', 'Reliability'],
    link: "#",
    icon: <ShieldCheck className="text-orange-400" size={24} />,
    isInteractive: true
  }
];

export default function App() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoTab, setDemoTab] = useState<string>('tab1');
  const [showCV, setShowCV] = useState(false);

  const openDemo = (id: string) => {
    setActiveDemo(id);
    setDemoTab('tab1'); // Reset to first tab on open
  };

  const renderActiveWidget = () => {
    if (activeDemo === 'telemetry-suite') {
        return (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700 backdrop-blur-sm">
                        <button 
                            onClick={() => setDemoTab('tab1')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${demoTab === 'tab1' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                           <TrendingUp size={16}/> The Safety Scorecard
                        </button>
                        <button 
                            onClick={() => setDemoTab('tab2')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${demoTab === 'tab2' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                           <Server size={16}/> FleetPulse Dashboard
                        </button>
                    </div>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {demoTab === 'tab1' ? <DriverEPKWidget /> : <FleetPulseWidget />}
                </div>
            </div>
        );
    }
    
    if (activeDemo === 'xai-suite') {
         return (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700 backdrop-blur-sm">
                        <button 
                            onClick={() => setDemoTab('tab1')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${demoTab === 'tab1' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                           <GraduationCap size={16}/> GlassBox Learner
                        </button>
                        <button 
                            onClick={() => setDemoTab('tab2')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${demoTab === 'tab2' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                           <Cpu size={16}/> XAI Model Lab
                        </button>
                    </div>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                     {demoTab === 'tab1' ? <ResilienceWidget /> : <XAIWidget />}
                </div>
            </div>
        );
    }

    if (activeDemo === 'qa-suite') return <QAWidget />;
    
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header / Hero */}
        <header className="max-w-7xl mx-auto pt-12 pb-12 px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 animate-pulse">
                  OPEN TO WORK
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-blue-400">
                  PO + DEV + DATA
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-4 tracking-tight">
                Lucielton Manoel
              </h1>
              
              <p className="text-xl text-slate-400 font-light mb-2">
                Technical Product Owner & Data Strategist
              </p>
              
              <p className="text-slate-500 max-w-2xl leading-relaxed">
                MSc Student in AI (XAI) | Telemetry Specialist | Ex-Full Stack.
                <br />
                I bridge the gap between business strategy and technical execution using a 
                <span className="text-slate-300 font-medium"> "Show, Don't Tell"</span> approach.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <button 
                  onClick={() => setShowCV(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 font-medium hover:scale-105 active:scale-95"
                >
                  <FileText size={18} /> View CV
                </button>
                <a href="https://linkedin.com/in/lucielton" target="_blank" rel="noreferrer" className="p-2.5 border border-slate-700 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-white transition-all">
                  <Linkedin size={20} />
                </a>
                <a href="https://github.com/lucielton" target="_blank" rel="noreferrer" className="p-2.5 border border-slate-700 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-white transition-all">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Modal/Overlay for Demos */}
        {activeDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-5xl relative">
              <button 
                onClick={() => setActiveDemo(null)}
                className="absolute -top-10 right-0 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700"
              >
                Close Demo <X size={20} className="group-hover:rotate-90 transition-transform"/>
              </button>
              {renderActiveWidget()}
            </div>
          </div>
        )}

        {/* CV Modal */}
        {showCV && <CVModal onClose={() => setShowCV(false)} />}

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
              <Zap size={24} className="text-yellow-400" />
              <h2 className="text-2xl font-bold text-slate-200">Portfolio Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Telemetry */}
              <div className="flex flex-col gap-6">
                {telemetryProjects.map((proj) => (
                    <ProjectCard 
                    key={proj.id} 
                    project={proj} 
                    onInteract={() => openDemo(proj.id)}
                    />
                ))}
              </div>

              {/* Column 2: XAI */}
              <div className="flex flex-col gap-6">
                 {xaiProjects.map((proj) => (
                    <ProjectCard 
                    key={proj.id} 
                    project={proj} 
                    onInteract={() => openDemo(proj.id)}
                    />
                ))}
              </div>

              {/* Column 3: Engineering */}
              <div className="flex flex-col gap-6">
                {engProjects.map((proj) => (
                    <ProjectCard 
                    key={proj.id} 
                    project={proj} 
                    onInteract={() => openDemo(proj.id)}
                    />
                ))}
              </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Lucielton Manoel. Built with React & Tailwind.</p>
          <p className="mt-2 text-xs">Strategy: "Show, Don't Tell"</p>
        </footer>
      </div>
    </div>
  );
}