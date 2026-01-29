import React, { useState } from 'react';
import { Play, CheckCircle, RefreshCw, Circle, Terminal, Clock, ShieldCheck, XCircle, AlertOctagon } from 'lucide-react';

interface TestStep {
    id: number;
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    duration: number;
    errorMsg?: string;
}

const QAWidget: React.FC = () => {
    const [activeSuite, setActiveSuite] = useState<'telemetry' | 'xai'>('telemetry');
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const telemetrySuite: TestStep[] = [
        { id: 1, name: 'Docker: Spin up Telemetry Ingestor', status: 'pending', duration: 800 },
        { id: 2, name: 'Unit: Validate TelemetryPoint Schema', status: 'pending', duration: 120 },
        { id: 3, name: 'API: Fetch Weather (OpenMeteo)', status: 'pending', duration: 450 },
        { id: 4, name: 'Integration: Kafka Stream Prod/Cons', status: 'pending', duration: 300 },
        { id: 5, name: 'Logic: Event Detection (Speed > 100)', status: 'pending', duration: 150 },
        { id: 6, name: 'Logic: EPK Calculation per Driver', status: 'pending', duration: 200 },
        { id: 7, name: 'DB: Write to TimescaleDB', status: 'pending', duration: 400 },
        { id: 8, name: 'E2E: Render Fleet Dashboard', status: 'pending', duration: 900 },
        { id: 9, name: 'Alerts: Send Slack Notification', status: 'pending', duration: 1500, errorMsg: 'Timeout: Webhook did not respond in 1000ms' },
        { id: 10, name: 'Sec: Verify JWT Token', status: 'pending', duration: 200, errorMsg: 'AuthError: Token Expired' },
    ];

    const xaiSuite: TestStep[] = [
        { id: 1, name: 'Setup: Sparklyr Context', status: 'pending', duration: 1200 },
        { id: 2, name: 'Data: Load PISA/SAEB Dataset', status: 'pending', duration: 800 },
        { id: 3, name: 'Model: Train Random Forest (RF)', status: 'pending', duration: 1500 },
        { id: 4, name: 'Model: Train Logistic Regression', status: 'pending', duration: 600 },
        { id: 5, name: 'XAI: Compute SHAP Values', status: 'pending', duration: 900 },
        { id: 6, name: 'XAI: Generate DALEX Residuals', status: 'pending', duration: 700 },
        { id: 7, name: 'Logic: Resilience Threshold Check', status: 'pending', duration: 150 },
        { id: 8, name: 'API: Hipolabs University Sync', status: 'pending', duration: 400 },
        { id: 9, name: 'E2E: Resilience Dashboard Render', status: 'pending', duration: 850 },
        { id: 10, name: 'Export: PDF Report Generation', status: 'pending', duration: 1100 },
    ];

    const [steps, setSteps] = useState<TestStep[]>(telemetrySuite);

    const switchSuite = (suite: 'telemetry' | 'xai') => {
        if (isRunning) return;
        setActiveSuite(suite);
        setSteps(suite === 'telemetry' ? telemetrySuite : xaiSuite);
        setLogs([]);
    };

    const runTests = async () => {
        if (isRunning) return;
        setIsRunning(true);
        const suiteName = activeSuite === 'telemetry' ? 'Telemetry & Fleet System' : 'XAI & Resilience Engine';
        setLogs([`> Initializing Playwright Runner for ${suiteName}...`, '> Checking Docker containers...', '> Connected to CI environment.']);
        
        // Reset states
        const currentSteps = activeSuite === 'telemetry' ? telemetrySuite : xaiSuite;
        const newSteps = currentSteps.map(s => ({ ...s, status: 'pending' as const }));
        setSteps(newSteps);

        for (let i = 0; i < newSteps.length; i++) {
            // Set current step to running
            setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
            
            await new Promise(r => setTimeout(r, newSteps[i].duration));
            
            const shouldFail = activeSuite === 'telemetry' && (i === 8 || i === 9); // Fail last two steps of telemetry
            
            if (shouldFail) {
                 setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'failed' } : s));
                 setLogs(prev => [...prev, `[FAIL] ${newSteps[i].name}`, `       ↳ ${newSteps[i].errorMsg}`]);
            } else {
                 setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'passed' } : s));
                 setLogs(prev => [...prev, `[PASS] ${newSteps[i].name} (${newSteps[i].duration}ms)`]);
            }
        }

        const passedCount = activeSuite === 'telemetry' ? 8 : 10;
        const total = 10;
        
        setLogs(prev => [...prev, `> Suite completed.`, `> Result: ${passedCount}/${total} Passed.`]);
        if (activeSuite === 'telemetry') {
            setLogs(prev => [...prev, `> CI/CD Job failed. Sending Slack alert to #devops-alerts.`]);
        }
        setIsRunning(false);
    };

    return (
        <div className="bg-[#0b101a] rounded-xl border border-white/5 p-4 md:p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 gap-4">
                <div>
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    Quality Assurance Hub
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                    Centralized CI/CD pipeline monitor.
                </p>
                </div>
                <div className="flex gap-1 bg-[#0f172a] p-1 rounded-lg border border-white/10 w-full md:w-auto">
                    <button 
                        onClick={() => switchSuite('telemetry')}
                        className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-bold rounded transition-colors ${activeSuite === 'telemetry' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Telemetry Core
                    </button>
                    <button 
                        onClick={() => switchSuite('xai')}
                        className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-bold rounded transition-colors ${activeSuite === 'xai' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        XAI Engine
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Steps List */}
                <div className="bg-[#0f172a]/50 rounded-lg p-4 border border-white/5 flex flex-col h-[350px] md:h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${activeSuite === 'telemetry' ? 'bg-cyan-500' : 'bg-fuchsia-500'} animate-pulse`}></span>
                            Active Suite
                        </h3>
                        <button 
                            onClick={runTests}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-amber-900/40 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isRunning ? <Clock size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                            Run Suite
                        </button>
                    </div>
                   
                    <div className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        {steps.map(step => (
                            <div key={step.id} className={`flex items-center justify-between p-3 rounded border transition-colors ${step.status === 'failed' ? 'bg-red-950/30 border-red-500/30' : 'bg-[#0b101a] border-white/5'}`}>
                                <div className="flex items-center gap-3">
                                    {step.status === 'pending' && <Circle size={16} className="text-slate-600" />}
                                    {step.status === 'running' && <RefreshCw size={16} className="text-blue-400 animate-spin" />}
                                    {step.status === 'passed' && <CheckCircle size={16} className="text-emerald-400" />}
                                    {step.status === 'failed' && <XCircle size={16} className="text-red-400" />}
                                    <span className={`text-xs font-medium ${step.status === 'failed' ? 'text-red-300' : step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>
                                        {step.name}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-mono ${step.status === 'failed' ? 'text-red-400' : 'text-slate-600'}`}>
                                    {step.duration}ms
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="bg-[#050505] rounded-lg p-4 font-mono text-xs text-amber-500 border border-white/10 overflow-y-auto h-[250px] md:h-[400px] shadow-inner flex flex-col relative group">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-700">bash</div>
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-slate-400 select-none">
                        <Terminal size={12} /> CI/CD Console Output
                    </div>
                    <div className="flex-grow space-y-1">
                        {logs.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-800 italic">
                                Waiting for test runner trigger...
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className={`break-all animate-in fade-in slide-in-from-left-2 duration-300 ${log.includes('[FAIL]') ? 'text-red-400' : ''} ${log.includes('Result') ? 'font-bold text-emerald-400 border-t border-white/10 pt-2 mt-2' : ''}`}>
                                    {!log.startsWith('   ') && <span className="text-slate-700 mr-2 select-none">{(new Date()).toLocaleTimeString().split(' ')[0]}</span>}
                                    {log}
                                </div>
                            ))
                        )}
                        {isRunning && <div className="animate-pulse text-amber-500/50">_</div>}
                    </div>
                </div>
            </div>
             <div className="mt-6 p-3 bg-amber-900/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 flex gap-2">
                <div className="mt-0.5"><AlertOctagon size={14}/></div>
                <div>
                <strong>Quality Insight:</strong> By running automated E2E tests for both Telemetry and XAI pipelines in a simulated CI/CD environment, we prevent regressions before they reach production.
                </div>
            </div>
        </div>
    );
};

export default QAWidget;