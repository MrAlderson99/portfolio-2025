import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TriangleAlert, MapPin, Truck, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { DriverStats } from '../types';
import InfoTooltip from './InfoTooltip';

const DriverEPKWidget: React.FC = () => {
    const [drivers, setDrivers] = useState<DriverStats[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('All');
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isListOpen, setIsListOpen] = useState(true); // For mobile toggle

    const fetchRealUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://randomuser.me/api/?results=24&nat=br,us,gb');
            const data = await res.json();
            
            const fleetHubs = ['São Paulo', 'London', 'New York', 'Austin'];
            const vehicles = ['Truck-A', 'Truck-B', 'Van-01', 'Van-02', 'Lorry-X', 'Pickup-Z'];
            
            const processedDrivers: DriverStats[] = data.results.map((u: any, index: number) => {
                const city = fleetHubs[index % fleetHubs.length]; 
                const totalKm = Math.floor(Math.random() * 3000) + 500;
                const totalEvents = Math.floor(Math.random() * 50);
                const epk = parseFloat((totalEvents / totalKm).toFixed(3));
                
                let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
                if (epk > 0.03) riskLevel = 'Medium';
                if (epk > 0.05) riskLevel = 'High';

                const events = ['Hard Braking', 'Sharp Turn', 'Speeding', 'Idle Time'];
                const topEvent = events[Math.floor(Math.random() * events.length)];

                return {
                    id: u.login.uuid,
                    name: `${u.name.first} ${u.name.last}`,
                    avatar: u.picture.thumbnail,
                    city: city,
                    totalKm,
                    totalEvents,
                    epk,
                    riskLevel,
                    topEvent,
                    vehicle: vehicles[Math.floor(Math.random() * vehicles.length)]
                };
            });

            setDrivers(processedDrivers);
            setSelectedDriverId(processedDrivers[0].id);
        } catch (e) {
            console.error("Failed to fetch users", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealUsers();
    }, []);

    const filteredDrivers = selectedCity === 'All' 
        ? drivers 
        : drivers.filter((d) => d.city === selectedCity);

    const currentDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];
    
    // Simulate XAI Data for the selected driver
    const xaiData = [
        { subject: 'Traffic', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Weather', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Route', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Time', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Vehicle', A: Math.floor(Math.random() * 100), fullMark: 100 },
    ];

    const chartData = [
        { name: 'Mon', events: Math.floor(Math.random() * 10) },
        { name: 'Tue', events: Math.floor(Math.random() * 10) },
        { name: 'Wed', events: Math.floor(Math.random() * 10) },
        { name: 'Thu', events: Math.floor(Math.random() * 10) },
        { name: 'Fri', events: Math.floor(Math.random() * 10) },
    ];

    if (loading) return <div className="p-10 text-center text-cyan-500 animate-pulse">Connecting to Fleet Cloud...</div>;

    return (
        <div className="bg-[#0b101a] rounded-xl border border-white/5 p-4 md:p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2 neon-text-blue">
                        <TrendingUp size={20} />
                        The Safety Scorecard
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Coaching data sourced from <span className="font-mono text-xs text-blue-300 bg-blue-900/20 px-1 rounded">randomuser.me</span> API
                    </p>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Filter size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"/>
                        <select 
                            className="w-full bg-[#0f172a] border border-white/10 text-slate-200 text-sm rounded-lg pl-8 pr-2 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="All">All Cities</option>
                            <option value="São Paulo">São Paulo (BR)</option>
                            <option value="London">London (UK)</option>
                            <option value="New York">New York (US)</option>
                            <option value="Austin">Austin (US)</option>
                        </select>
                    </div>
                     <button onClick={fetchRealUsers} className="p-2 bg-[#0f172a] rounded-lg border border-white/10 hover:bg-slate-800 text-slate-400 transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Driver List - Collapsible on Mobile */}
                <div className="lg:col-span-1 flex flex-col">
                    <button 
                        className="lg:hidden w-full flex justify-between items-center p-3 bg-[#0f172a] border border-white/10 rounded-lg text-sm font-bold text-slate-300 mb-4"
                        onClick={() => setIsListOpen(!isListOpen)}
                    >
                        {isListOpen ? 'Hide Drivers List' : `Show Drivers List (${filteredDrivers.length})`}
                        <ChevronDown size={16} className={`transition-transform ${isListOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    <div className={`space-y-3 h-[300px] lg:h-[450px] overflow-y-auto pr-2 custom-scrollbar transition-all ${isListOpen ? 'block' : 'hidden lg:block'}`}>
                        {filteredDrivers.map((driver) => (
                            <div 
                                key={driver.id}
                                onClick={() => { setSelectedDriverId(driver.id); setIsListOpen(false); }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDriverId === driver.id ? 'bg-blue-900/20 border-blue-500/50 shadow-md' : 'bg-[#0f172a]/50 border-white/5 hover:bg-[#0f172a]'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-3">
                                        <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full border border-slate-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-200">{driver.name}</div>
                                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <MapPin size={8} /> {driver.city}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${driver.riskLevel === 'High' ? 'text-red-400 bg-red-950/30' : driver.riskLevel === 'Medium' ? 'text-amber-400 bg-amber-950/30' : 'text-emerald-400 bg-emerald-950/30'}`}>
                                        {driver.epk.toFixed(3)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Stats Area */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Driver Detail Header */}
                     <div className="md:col-span-2 bg-[#0f172a]/80 p-4 rounded-lg border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <img src={currentDriver.avatar} className="w-14 h-14 rounded-full border-2 border-blue-500 shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]" />
                            <div>
                                <h3 className="text-xl font-bold text-white">{currentDriver.name}</h3>
                                <div className="text-xs text-slate-400 flex gap-3 mt-1">
                                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"><Truck size={12}/> {currentDriver.vehicle}</span>
                                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"><MapPin size={12}/> {currentDriver.city}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto text-right bg-slate-900/50 p-2 rounded border border-white/5">
                             <div className="text-[10px] text-slate-500 uppercase font-bold">Top Risk Factor</div>
                             <div className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1">
                                <TriangleAlert size={14} /> {currentDriver.topEvent}
                             </div>
                        </div>
                     </div>

                     {/* Breakdown Charts */}
                    <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5 h-64 md:h-auto">
                        <h4 className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-2">
                            Weekly Events Trend
                        </h4>
                        <div className="h-40 md:h-48">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#64748b" tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                                    <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* XAI Radar */}
                    <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5 h-64 md:h-auto">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 justify-center">
                            Risk Factors (XAI)
                            <InfoTooltip text="Radar chart showing environmental correlation." />
                        </h4>
                         <div className="h-40 md:h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={xaiData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Impact Factor" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
             <div className="mt-6 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg text-xs text-blue-200 flex gap-2">
                <div className="mt-0.5">💡</div>
                <div className="leading-relaxed">
                <strong>Coaching Insight:</strong> Driver <strong>{currentDriver.name}</strong> is flagging high for <strong>{currentDriver.topEvent}</strong>. XAI Analysis suggests this correlates 80% with <span className="font-bold text-cyan-400">Traffic Density</span> in the {currentDriver.city} region.
                </div>
            </div>
        </div>
    );
};

export default DriverEPKWidget;