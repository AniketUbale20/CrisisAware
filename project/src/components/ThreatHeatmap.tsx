import React, { useState, useEffect } from 'react';
import { Map, Layers, Filter, Maximize } from 'lucide-react';

interface HeatmapData {
  zone: string;
  emergencyLevel: number;
  fraudLevel: number;
  correlation: number;
  incidents: number;
  riskScore: number;
}

const mockHeatmapData: HeatmapData[] = [
  { zone: 'Financial District', emergencyLevel: 85, fraudLevel: 92, correlation: 78, incidents: 12, riskScore: 88 },
  { zone: 'Midtown', emergencyLevel: 65, fraudLevel: 45, correlation: 32, incidents: 8, riskScore: 54 },
  { zone: 'Upper East Side', emergencyLevel: 35, fraudLevel: 28, correlation: 15, incidents: 3, riskScore: 31 },
  { zone: 'Brooklyn Heights', emergencyLevel: 45, fraudLevel: 67, correlation: 52, incidents: 7, riskScore: 56 },
  { zone: 'Queens Plaza', emergencyLevel: 72, fraudLevel: 58, correlation: 41, incidents: 9, riskScore: 64 },
  { zone: 'Staten Island', emergencyLevel: 28, fraudLevel: 22, correlation: 18, incidents: 2, riskScore: 25 }
];

export const ThreatHeatmap: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'emergency' | 'fraud' | 'correlation'>('all');
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>(mockHeatmapData);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapData(prev => prev.map(zone => ({
        ...zone,
        emergencyLevel: Math.max(0, Math.min(100, zone.emergencyLevel + (Math.random() - 0.5) * 10)),
        fraudLevel: Math.max(0, Math.min(100, zone.fraudLevel + (Math.random() - 0.5) * 8)),
        correlation: Math.max(0, Math.min(100, zone.correlation + (Math.random() - 0.5) * 6))
      })));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getHeatLevel = (data: HeatmapData) => {
    switch (selectedFilter) {
      case 'emergency': return data.emergencyLevel;
      case 'fraud': return data.fraudLevel;
      case 'correlation': return data.correlation;
      default: return data.riskScore;
    }
  };

  const getHeatColor = (level: number) => {
    if (level >= 80) return 'bg-red-500/80 border-red-400';
    if (level >= 60) return 'bg-orange-500/80 border-orange-400';
    if (level >= 40) return 'bg-yellow-500/80 border-yellow-400';
    if (level >= 20) return 'bg-blue-500/80 border-blue-400';
    return 'bg-green-500/80 border-green-400';
  };

  const getFilterColor = (filter: string) => {
    return selectedFilter === filter 
      ? 'bg-blue-500 text-white' 
      : 'bg-slate-700 text-slate-300 hover:bg-slate-600';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Geo-Temporal Threat Analysis</h2>
        <div className="flex items-center space-x-2">
          <Map className="w-4 h-4 text-green-400" />
          <span className="text-sm text-slate-400">Live Heatmap</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-400 mr-2">Filter:</span>
        {['all', 'emergency', 'fraud', 'correlation'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter as any)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getFilterColor(filter)}`}
          >
            {filter === 'all' ? 'Overall Risk' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-lg p-4 mb-6" style={{ minHeight: '300px' }}>
        <div className="grid grid-cols-3 gap-4 h-full">
          {heatmapData.map((zone, index) => {
            const heatLevel = getHeatLevel(zone);
            return (
              <div
                key={zone.zone}
                className={`rounded-lg border-2 p-4 transition-all duration-300 hover:scale-105 cursor-pointer ${getHeatColor(heatLevel)}`}
                style={{
                  gridRow: index < 2 ? '1' : index < 4 ? '2' : '3',
                  opacity: 0.8 + (heatLevel / 500)
                }}
              >
                <div className="text-white font-semibold text-sm mb-2">{zone.zone}</div>
                <div className="text-white text-2xl font-bold mb-1">{Math.round(heatLevel)}%</div>
                <div className="text-white/80 text-xs">{zone.incidents} incidents</div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Emergency:</span>
                    <span>{Math.round(zone.emergencyLevel)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Fraud:</span>
                    <span>{Math.round(zone.fraudLevel)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Correlation:</span>
                    <span>{Math.round(zone.correlation)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Risk Layers</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-slate-700 rounded p-2">
              <span className="text-slate-300">Emergency Response</span>
              <span className="text-red-400 font-medium">High Activity</span>
            </div>
            <div className="flex items-center justify-between bg-slate-700 rounded p-2">
              <span className="text-slate-300">Financial Anomalies</span>
              <span className="text-orange-400 font-medium">Elevated</span>
            </div>
            <div className="flex items-center justify-between bg-slate-700 rounded p-2">
              <span className="text-slate-300">Correlation Patterns</span>
              <span className="text-yellow-400 font-medium">Moderate</span>
            </div>
            <div className="flex items-center justify-between bg-slate-700 rounded p-2">
              <span className="text-slate-300">Infrastructure Risk</span>
              <span className="text-green-400 font-medium">Normal</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Maximize className="w-4 h-4 text-purple-400" />
            <span>ML Predictions</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-700 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Next Hour Risk</span>
                <span className="text-red-400 font-medium">↑ 15%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                <div className="bg-red-400 h-1 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Fraud Probability</span>
                <span className="text-orange-400 font-medium">↑ 8%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                <div className="bg-orange-400 h-1 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div className="bg-slate-700 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Resource Demand</span>
                <span className="text-blue-400 font-medium">↓ 3%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                <div className="bg-blue-400 h-1 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};