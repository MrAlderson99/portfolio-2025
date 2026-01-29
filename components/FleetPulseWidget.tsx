import React, { useState, useEffect, useMemo } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { AlertTriangle, Gauge, Zap, RefreshCw, CloudRain, Sun, Cloud, DollarSign, Wrench, TrendingDown, MapPin } from 'lucide-react';
import { TelemetryPoint } from '../types';
import InfoTooltip from './InfoTooltip';

const cities = {
    'São Paulo': { lat: -23.5505, lng: -46.6333, currency: 'R$' },
    'New York': { lat: 40.7128, lng: -74.0060, currency: '$' },
    'London': { lat: 51.5074, lng: -0.1278, currency: '£' },
    'Tokyo': { lat: 35.6762, lng: 139.6503, currency: '¥' }
};

const FleetPulseWidget: React.FC = () => {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCity, setSelectedCity] = useState<keyof typeof cities>('São Paulo');
  const [weather, setWeather] = useState<{temp: number, condition: string, code: number} | null>(null);

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lng } = cities[selectedCity];
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await res.json();
        const code = data.current_weather.weathercode;
        
        let condition = 'Clear';
        if (code > 3) condition = 'Cloudy';
        if (code > 50) condition = 'Rainy';
        if (code > 70) condition = 'Snowy';
        
        setWeather({
          temp: data.current_weather.temperature,
          condition,
          code
        });
      } catch (e) {
        console.error("Failed to fetch weather", e);
        setWeather({ temp: 20, condition: 'Clear', code: 0 }); // Fallback
      }
    };
    fetchWeather();
  }, [selectedCity]);

  // Simulate Data Engineering pipeline based on Weather
  const generateData = () => {
    setIsGenerating(true);
    const vehicles = ['Truck-A', 'Truck-B', 'Van-01', 'Truck-C', 'Van-02', 'Lorry-X'];
    
    // Weather impacts driving behavior simulation
    const weatherImpact = weather?.condition === 'Rainy' || weather?.condition === 'Snowy' ? 0.8 : 1.0;
    const tempImpact = weather?.temp ? Math.max(0, (weather.temp - 25) * 0.5) : 0;

    const newData: TelemetryPoint[] = Array.from({ length: 150 }, (_, i) => {
      const baseSpeed = 60 * weatherImpact;
      const speed = Math.max(0, baseSpeed + (Math.random() * 80 - 20)); 
      
      const isCritical = speed > (weatherImpact < 1 ? 80 : 100); 
      
      const engineTemp = 80 + tempImpact + (speed * 0.2) + (Math.random() * 10); 
      
      return {
        id: i,
        vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)],
        speed: parseFloat(speed.toFixed(1)),
        engineTemp: parseFloat(engineTemp.toFixed(1)),
        fuelLevel: Math.floor(Math.random() * 100),
        status: isCritical ? 'Critical' : 'Normal'
      };
    });
    
    setTimeout(() => {
      setData(newData);
      setIsGenerating(false);
    }, 600);
  };

  useEffect(() => {
    if (weather) generateData();
  }, [weather]);

  const metrics = useMemo(() => {
    const infractions = data.filter(d => d.status === 'Critical').length;
    
    const currSymbol = cities[selectedCity].currency;
    const rate = selectedCity === 'São Paulo' ? 5.80 : selectedCity === 'London' ? 1.5 : selectedCity === 'Tokyo' ? 150 : 4.2;

    const totalKm = data.length * 1.5; 
    const totalFuelLiters = totalKm * 0.35;
    const fuelCost = totalFuelLiters * rate; 
    const maintCost = infractions * (rate * 25); 
    
    const vehicleCosts: Record<string, number> = {};
    data.forEach(d => {
        const cost = (1.5 * 0.35 * rate) + (d.status === 'Critical' ? rate * 25 : 0);
        vehicleCosts[d.vehicleId] = (vehicleCosts[d.vehicleId] || 0) + cost;
    });
    
    const mostExpensiveVehicle = Object.entries(vehicleCosts).sort((a,b) => b[1] - a[1])[0];

    const vehicleTemps: Record<string, number[]> = {};
    data.forEach(d => {
        if (!vehicleTemps[d.vehicleId]) vehicleTemps[d.vehicleId] = [];
        vehicleTemps[d.vehicleId].push(d.engineTemp);
    });
    
    const atRiskVehicles = Object.entries(vehicleTemps).map(([id, temps]) => {
        const avg = temps.reduce((a,b) => a+b, 0) / temps.length;
        const threshold = 95 + (weather?.temp && weather.temp > 30 ? 5 : 0);
        return { id, avgTemp: avg, risk: avg > threshold ? 'Critical' : avg > (threshold-5) ? 'Warning' : 'Healthy' };
    }).sort((a,b) => b.avgTemp - a.avgTemp);

    return {
      activeVehicles: new Set(data.map(d => d.vehicleId)).size,
      infractions,
      totalCost: fuelCost + maintCost,
      fuelConsumed: totalFuelLiters,
      mostExpensive: mostExpensiveVehicle,
      atRiskVehicles: atRiskVehicles.slice(0, 3),
      currency: currSymbol
    };
  }, [data, selectedCity, weather]);

  const WeatherIcon = () => {
    if (weather?.condition === 'Rainy') return <CloudRain size={16} className="text-blue-400" />;
    if (weather?.condition === 'Cloudy') return <Cloud size={16} className="text-slate-400" />;
    return <Sun size={16} className="text-yellow-400" />;
  };

  return (
    <div className="bg-[#0b101a] rounded-xl border border-white/5 p-4 md:p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2 neon-text-blue">
            <Zap size={20} />
            FleetPulse Telemetry
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
             <span className="text-slate-400 text-xs">Live Context:</span>
             {weather ? (
               <span className="flex items-center gap-1 text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-white/10 text-slate-200">
                 <WeatherIcon /> {weather.condition} {weather.temp}°C
               </span>
             ) : (
               <span className="text-xs text-slate-600 animate-pulse">Fetching weather API...</span>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
             <select 
                className="flex-grow md:flex-grow-0 bg-[#0f172a] border border-white/10 text-slate-200 text-sm rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as any)}
            >
                {Object.keys(cities).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <button 
            onClick={generateData}
            disabled={isGenerating}
            title="Refresh Data Pipeline"
            className="p-2 bg-cyan-900/20 hover:bg-cyan-900/40 rounded-lg border border-cyan-500/30 text-cyan-400 transition-colors disabled:opacity-50"
            >
            <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      {/* KPI Row - Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <DollarSign size={12}/> Est. Trip Cost
             <InfoTooltip text="Calculated based on fuel consumption rate + infraction penalties." />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.currency} {metrics.totalCost.toFixed(0)}</div>
        </div>
        <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <Gauge size={12}/> Fuel Consumed
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.fuelConsumed.toFixed(0)} <span className="text-sm text-slate-500">L</span></div>
        </div>
        <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
           <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <TrendingDown size={12}/> Highest Cost Unit
          </div>
           <div className="text-lg font-bold text-amber-400">{metrics.mostExpensive ? metrics.mostExpensive[0] : '-'}</div>
           <div className="text-[10px] text-slate-500 font-mono">{metrics.currency} {metrics.mostExpensive ? metrics.mostExpensive[1].toFixed(0) : 0}</div>
        </div>
         <div className="bg-red-950/10 p-4 rounded-lg border border-red-500/20 backdrop-blur-sm">
          <div className="text-red-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Infractions
            <InfoTooltip text="Speed > 100km/h (or > 80km/h in Rain)." />
          </div>
          <div className="text-2xl font-bold text-red-500">{metrics.infractions}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          {/* Scatter Chart */}
          <div className="lg:col-span-2 h-72 w-full bg-[#0f172a]/30 rounded-lg p-2 border border-white/5 relative">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 ml-2 absolute top-2 left-2 z-10">Telemetry Correlation</h4>
            <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 30, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="speed" name="Speed" unit="km/h" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis type="number" dataKey="engineTemp" name="Temp" unit="°C" stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Scatter name="Telemetry" data={data}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'Critical' ? '#ef4444' : '#06b6d4'} />
                ))}
                </Scatter>
            </ScatterChart>
            </ResponsiveContainer>
        </div>

        {/* Predictive Maintenance List */}
        <div className="lg:col-span-1 bg-[#0f172a]/30 rounded-lg p-4 border border-white/5">
            <h4 className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Wrench size={14} className="text-cyan-500"/> Predictive Maint.
                <InfoTooltip text="AI prediction based on sustained engine temperature deviations vs ambient weather." />
            </h4>
            <div className="space-y-3">
                {metrics.atRiskVehicles.map(v => (
                    <div key={v.id} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                        <div>
                            <div className="text-sm font-bold text-slate-200">{v.id}</div>
                            <div className="text-[10px] text-slate-500">Avg Temp: <span className="text-slate-300">{v.avgTemp.toFixed(1)}°C</span></div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                            v.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            v.risk === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                            {v.risk === 'Critical' ? 'Urgent' : v.risk === 'Warning' ? 'Check' : 'Good'}
                        </span>
                    </div>
                ))}
                {metrics.atRiskVehicles.length === 0 && <div className="text-center text-xs text-slate-600 py-4">No risks detected</div>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPulseWidget;