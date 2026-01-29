import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { User, TrendingUp, AlertTriangle, MapPin, Truck, RefreshCw, Filter } from 'lucide-react';
import { DriverStats } from '../types';
import InfoTooltip from './InfoTooltip';

const DriverEPKWidget: React.FC = () => {
    const [drivers, setDrivers] = useState<DriverStats[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('All');
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRealUsers = async () => {
        setLoading(true);
        try {
            // Fetch 20 users to act as our fleet drivers
            const res = await fetch('https://randomuser.me/api/?results=24&nat=br,us,gb');
            const data = await res.json();
            
            // Fixed set of "Fleet Hub" cities to map random users to
            const fleetHubs = ['São Paulo', 'London', 'New York', 'Austin'];
            const vehicles = ['Truck-A', 'Truck-B', 'Van-01', 'Van-02', 'Lorry-X', 'Pickup-Z'];
            
            const processedDrivers: DriverStats[] = data.results.map((u: any, index: number) => {
                const city = fleetHubs[index % fleetHubs.length]; // Distribute evenly
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
                    city: city, // Enhanced type to include city
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
        : drivers.filter((d: any) => d.city === selectedCity);

    const currentDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];
    
    // Simulate XAI Data for the selected driver
    const xaiData = [
        { subject: 'Traffic Density', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Weather', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Route Type', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Time of Day', A: Math.floor(Math.random() * 100), fullMark: 100 },
        { subject: 'Vehicle Age', A: Math.floor(Math.random() * 100), fullMark: 100 },
    ];

    const chartData = [
        { name: 'Mon', events: Math.floor(Math.random() * 10) },
        { name: 'Tue', events: Math.floor(Math.random() * 10) },
        { name: 'Wed', events: Math.floor(Math.random() * 10) },
        { name: 'Thu', events: Math.floor(Math.random() * 10) },
        { name: 'Fri', events: Math.floor(Math.random() * 10) },
    ];

    if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Connecting to Fleet Cloud...</div>;

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <TrendingUp size={20} />
                        The Safety Scorecard
                        <InfoTooltip text="Calculates a normalized safety score based on Events Per Kilometer (EPK)." />
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Real-time coaching data sourced from <span className="font-mono text-xs text-blue-300 bg-blue-900/20 px-1 rounded">randomuser.me</span> API
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500"/>
                    <select 
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="All">All Cities</option>
                        <option value="São Paulo">São Paulo (BR)</option>
                        <option value="London">London (UK)</option>
                        <option value="New York">New York (US)</option>
                        <option value="Austin">Austin (US)</option>
                    </select>
                     <button onClick={fetchRealUsers} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Driver List */}
                <div className="lg:col-span-1 space-y-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Active Drivers ({filteredDrivers.length})
                        </h3>
                    </div>
                    
                    {filteredDrivers.map((driver: any) => (
                        <div 
                            key={driver.id}
                            onClick={() => setSelectedDriverId(driver.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDriverId === driver.id ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full border border-slate-600" />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-200">{driver.name}</div>
                                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <MapPin size={8} /> {driver.city}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold ${driver.riskLevel === 'High' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : driver.riskLevel === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'}`}>
                                    {driver.epk.toFixed(3)} EPK
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Stats Area */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                     {/* Driver Detail Header */}
                     <div className="md:col-span-2 bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={currentDriver.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                            <div>
                                <h3 className="text-lg font-bold text-white">{currentDriver.name}</h3>
                                <div className="text-xs text-slate-400 flex gap-3">
                                    <span className="flex items-center gap-1"><Truck size={12}/> {(currentDriver as any).vehicle}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {(currentDriver as any).city}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-slate-500 uppercase">Top Risk Factor</div>
                             <div className="text-sm font-bold text-orange-400 flex items-center justify-end gap-1">
                                <AlertTriangle size={14} /> {currentDriver.topEvent}
                             </div>
                        </div>
                     </div>

                     {/* Breakdown Charts */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <h4 className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-2">
                            Weekly Trend
                        </h4>
                        <div className="h-40">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} />
                                    <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* XAI Radar */}
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 justify-center">
                            Risk Factors (XAI)
                            <InfoTooltip text="Radar chart showing environmental correlation." />
                        </h4>
                         <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={xaiData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Impact Factor" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
             <div className="mt-6 p-3 bg-blue-900/20 border border-blue-800/50 rounded text-xs text-blue-200 flex gap-2">
                <div className="mt-0.5">💡</div>
                <div>
                <strong>Coaching Insight:</strong> Driver <strong>{currentDriver.name}</strong> from {(currentDriver as any).city} is flagging high for <strong>{currentDriver.topEvent}</strong>. XAI Analysis suggests this correlates 80% with <span className="font-bold">Traffic Density</span> in their region.
                </div>
            </div>
        </div>
    );
};

export default DriverEPKWidget;