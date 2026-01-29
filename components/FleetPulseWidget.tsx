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
    // Rain/Snow -> Slower speeds generally, but if high speed -> High risk
    const weatherImpact = weather?.condition === 'Rainy' || weather?.condition === 'Snowy' ? 0.8 : 1.0;
    const tempImpact = weather?.temp ? Math.max(0, (weather.temp - 25) * 0.5) : 0;

    const newData: TelemetryPoint[] = Array.from({ length: 150 }, (_, i) => {
      const baseSpeed = 60 * weatherImpact;
      const speed = Math.max(0, baseSpeed + (Math.random() * 80 - 20)); 
      
      const isCritical = speed > (weatherImpact < 1 ? 80 : 100); // Lower threshold if bad weather
      
      // Engine temp affected by outside temp + speed
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
        // Higher threshold for hotter cities
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
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <Zap size={20} />
            FleetPulse Telemetry
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-slate-400 text-sm">Live Context:</span>
             {weather ? (
               <span className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-200">
                 <WeatherIcon /> {weather.condition} {weather.temp}°C
               </span>
             ) : (
               <span className="text-xs text-slate-600 animate-pulse">Fetching weather API...</span>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
             <select 
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as any)}
            >
                {Object.keys(cities).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <button 
            onClick={generateData}
            disabled={isGenerating}
            title="Refresh Data Pipeline"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors disabled:opacity-50"
            >
            <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      {/* KPI Row - Financials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <DollarSign size={12}/> Est. Trip Cost
             <InfoTooltip text="Calculated based on fuel consumption rate + infraction penalties." />
          </div>
          <div className="text-xl font-bold text-white">{metrics.currency} {metrics.totalCost.toFixed(0)}</div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <Gauge size={12}/> Fuel Consumed
          </div>
          <div className="text-xl font-bold text-blue-400">{metrics.fuelConsumed.toFixed(0)} L</div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
           <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
             <TrendingDown size={12}/> Highest Cost Unit
          </div>
           <div className="text-sm font-bold text-orange-400">{metrics.mostExpensive ? metrics.mostExpensive[0] : '-'}</div>
           <div className="text-[10px] text-slate-500">{metrics.currency} {metrics.mostExpensive ? metrics.mostExpensive[1].toFixed(0) : 0}</div>
        </div>
         <div className="bg-slate-800/50 p-3 rounded-lg border border-red-900/30">
          <div className="text-red-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Infractions
            <InfoTooltip text="Speed > 100km/h (or > 80km/h in Rain)." />
          </div>
          <div className="text-xl font-bold text-red-400">{metrics.infractions}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          {/* Scatter Chart */}
          <div className="md:col-span-2 h-64 w-full bg-slate-800/30 rounded-lg p-2 border border-slate-700/30">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 ml-2">Telemetry Correlation: Speed vs Engine Temp</h4>
            <ResponsiveContainer width="100%" height="90%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="speed" name="Speed" unit="km/h" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis type="number" dataKey="engineTemp" name="Temp" unit="°C" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', fontSize: '12px' }} />
                <Scatter name="Telemetry" data={data}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'Critical' ? '#ef4444' : '#3b82f6'} />
                ))}
                </Scatter>
            </ScatterChart>
            </ResponsiveContainer>
        </div>

        {/* Predictive Maintenance List */}
        <div className="md:col-span-1 bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
            <h4 className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Wrench size={14}/> Predictive Maint.
                <InfoTooltip text="AI prediction based on sustained engine temperature deviations vs ambient weather." />
            </h4>
            <div className="space-y-3">
                {metrics.atRiskVehicles.map(v => (
                    <div key={v.id} className="flex justify-between items-center pb-2 border-b border-slate-700/50 last:border-0">
                        <div>
                            <div className="text-sm font-bold text-slate-200">{v.id}</div>
                            <div className="text-[10px] text-slate-500">Avg Temp: {v.avgTemp.toFixed(1)}°C</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                            v.risk === 'Critical' ? 'bg-red-900/30 text-red-400' :
                            v.risk === 'Warning' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-emerald-900/30 text-emerald-400'
                        }`}>
                            {v.risk === 'Critical' ? 'Urgent Service' : v.risk === 'Warning' ? 'Check Soon' : 'Optimal'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPulseWidget;