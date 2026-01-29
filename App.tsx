import { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Server, 
  Brain, 
  ShieldCheck, 
  X, 
  TrendingUp, 
  GraduationCap, 
  Cpu, 
  Activity, 
  Zap, 
  ChevronRight, 
  ListTodo
} from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import FleetPulseWidget from './components/FleetPulseWidget';
import XAIWidget from './components/XAIWidget';
import QAWidget from './components/QAWidget';
import DriverEPKWidget from './components/DriverEPKWidget';
import ResilienceWidget from './components/ResilienceWidget';
import TaskmasterWidget from './components/TaskmasterWidget';
import CVModal from './components/CVModal';
import { Project } from './types';

// Group 1: Telemetry & Fleet (Cyan/Blue Theme)
const telemetryProjects: Project[] = [
  {
    id: 'telemetry-suite',
    title: "Fleet & Safety Intelligence",
    description: "End-to-end telemetry suite combining 'The Safety Scorecard' (Driver Coaching) and 'FleetPulse' (Operational Analytics). Features real-time ingestion pipelines.",
    tags: ['Telemetry', 'IoT', 'Big Data', 'Driver Scoring', 'Predictive Maint.'],
    link: "https://github.com/lucielton/fleet-pulse",
    icon: <Activity className="text-cyan-400" size={24} />,
    isInteractive: true
  }
];

// Group 2: XAI & Education (Purple/Pink Theme)
const xaiProjects: Project[] = [
  {
    id: 'xai-suite',
    title: "Explainable AI (XAI) Research",
    description: "Interactive research lab comparing Black-box vs Glass-box models. Features 'GlassBox Learner' for resilience and 'XAI Lab' for model comparison.",
    tags: ['XAI', 'SHAP', 'Education', 'Random Forest', 'Research'],
    link: "#",
    icon: <Brain className="text-fuchsia-400" size={24} />,
    isInteractive: true
  }
];

// Group 3: Engineering (Orange/Amber Theme)
const engProjects: Project[] = [
  {
    id: 'qa-suite',
    title: "Engineering Excellence",
    description: "Automated Quality Assurance Hub. Runs real-time E2E regression tests (simulated Playwright) for Telemetry and XAI pipelines to ensure reliability.",
    tags: ['QA', 'CI/CD', 'Automated Testing', 'DevOps', 'Reliability'],
    link: "#",
    icon: <ShieldCheck className="text-amber-400" size={24} />,
    isInteractive: true
  }
];

// Group 4: Product Strategy (Emerald/Green Theme)
const productProjects: Project[] = [
  {
    id: 'taskmaster',
    title: "The Contextual Taskmaster",
    description: "A productivity engine that prioritizes tasks based on Context (Location), Energy Levels, and Time Gaps. Features a dynamic sorting algorithm.",
    tags: ['Product Strategy', 'Prioritization', 'Algorithm Design', 'UX Research'],
    link: "#", 
    icon: <ListTodo className="text-emerald-400" size={24} />,
    isInteractive: true
  }
];

export default function App() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoTab, setDemoTab] = useState<string>('tab1');
  const [showCV, setShowCV] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeDemo || showCV) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDemo, showCV]);

  const openDemo = (id: string) => {
    setActiveDemo(id);
    setDemoTab('tab1'); 
  };

  const renderActiveWidget = () => {
    if (activeDemo === 'telemetry-suite') {
        return (
            <div className="space-y-6">
                <div className="flex justify-center w-full">
                    <div className="flex bg-[#0f172a]/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-cyan-900/20 max-w-full overflow-x-auto">
                        <button 
                            onClick={() => setDemoTab('tab1')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${demoTab === 'tab1' ? 'bg-cyan-600 text-white shadow-[0_0_15px_-3px_rgba(8,145,178,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                           <TrendingUp size={16}/> Safety Scorecard
                        </button>
                        <button 
                            onClick={() => setDemoTab('tab2')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${demoTab === 'tab2' ? 'bg-blue-600 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                           <Server size={16}/> FleetPulse Ops
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
                <div className="flex justify-center w-full">
                    <div className="flex bg-[#0f172a]/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-purple-900/20 max-w-full overflow-x-auto">
                        <button 
                            onClick={() => setDemoTab('tab1')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${demoTab === 'tab1' ? 'bg-teal-600 text-white shadow-[0_0_15px_-3px_rgba(13,148,136,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                           <GraduationCap size={16}/> GlassBox Learner
                        </button>
                        <button 
                            onClick={() => setDemoTab('tab2')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${demoTab === 'tab2' ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_-3px_rgba(192,38,211,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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

    if (activeDemo === 'taskmaster') return <TaskmasterWidget />;
    
    return null;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background decoration - Adjusted for Neon vibe */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-600/5 rounded-full blur-[100px] animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Header / Hero */}
        <header className="max-w-7xl mx-auto pt-16 pb-16 px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-400 animate-pulse shadow-[0_0_10px_-3px_rgba(34,211,238,0.4)]">
                  OPEN TO WORK
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-blue-300">
                  PO + DEV + DATA
                </span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                    Lucielton Manoel
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 font-light">
                  Technical Product Owner & Data Strategist
                </p>
              </div>
              
              <p className="text-slate-400 max-w-2xl leading-relaxed text-base md:text-lg">
                MSc Student in AI (XAI) | Telemetry Specialist | Ex-Full Stack.
                <br className="hidden md:block"/>
                I bridge the gap between business strategy and technical execution using a 
                <strong className="text-slate-200 border-b border-cyan-500/50 pb-0.5"> "Show, Don't Tell"</strong> approach.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setShowCV(true)}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] font-semibold hover:scale-105 active:scale-95"
                >
                  <FileText size={18} /> View CV
                  <ChevronRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </button>
                <a href="https://linkedin.com/in/lucielton" target="_blank" rel="noreferrer" className="p-3 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-400 hover:shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)] text-slate-400 transition-all">
                  <Linkedin size={22} />
                </a>
                <a href="https://github.com/lucielton" target="_blank" rel="noreferrer" className="p-3 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 hover:border-purple-400/50 hover:text-purple-400 hover:shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)] text-slate-400 transition-all">
                  <Github size={22} />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Modal/Overlay for Demos */}
        {activeDemo && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto pt-4 pb-4 md:p-4">
            <div className="w-full max-w-6xl relative my-auto px-2 md:px-0">
              <div className="flex justify-end mb-4 sticky top-0 z-50 md:static">
                <button 
                    onClick={() => setActiveDemo(null)}
                    className="text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2 group bg-[#0f172a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg"
                >
                    Close Demo <X size={18} className="group-hover:rotate-90 transition-transform"/>
                </button>
              </div>
              {renderActiveWidget()}
            </div>
          </div>
        )}

        {/* CV Modal */}
        {showCV && <CVModal onClose={() => setShowCV(false)} />}

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-4">
              <Zap size={24} className="text-yellow-400 animate-pulse" />
              <h2 className="text-2xl font-bold text-slate-200 tracking-tight">Portfolio Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {/* Column 1: Telemetry */}
              <div className="flex flex-col gap-6">
                {telemetryProjects.map((proj) => (
                    <ProjectCard 
                        key={proj.id} 
                        project={proj} 
                        onInteract={() => openDemo(proj.id)}
                        theme="cyan"
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
                        theme="purple"
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
                        theme="amber"
                    />
                ))}
              </div>

              {/* Column 4: Product Strategy */}
              <div className="flex flex-col gap-6">
                {productProjects.map((proj) => (
                    <ProjectCard 
                        key={proj.id} 
                        project={proj} 
                        onInteract={() => openDemo(proj.id)}
                        theme="emerald"
                    />
                ))}
              </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm bg-[#010409]">
          <p>© {new Date().getFullYear()} Lucielton Manoel. Built with <span className="text-cyan-500">React</span>, <span className="text-purple-500">Vite</span> & <span className="text-blue-500">Tailwind</span>.</p>
          <p className="mt-2 text-xs opacity-60">Strategy: "Show, Don't Tell"</p>
        </footer>
      </div>
    </div>
  );
}