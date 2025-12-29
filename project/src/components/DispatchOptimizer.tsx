import React, { useState, useEffect } from 'react';
import { Navigation, Clock, Route, Users, Zap, MapPin } from 'lucide-react';

interface DispatchRoute {
  id: string;
  incidentId: string;
  responderType: 'fire' | 'police' | 'medical' | 'hazmat';
  units: number;
  estimatedTime: number;
  distance: number;
  trafficDelay: number;
  weatherImpact: 'none' | 'low' | 'medium' | 'high';
  optimizationScore: number;
  route: string[];
}

const mockRoutes: DispatchRoute[] = [
  {
    id: '1',
    incidentId: '1',
    responderType: 'fire',
    units: 3,
    estimatedTime: 4.2,
    distance: 2.8,
    trafficDelay: 1.2,
    weatherImpact: 'low',
    optimizationScore: 94,
    route: ['Station 14', 'Broadway', '42nd St', 'Incident Location']
  },
  {
    id: '2',
    incidentId: '2',
    responderType: 'police',
    units: 2,
    estimatedTime: 6.8,
    distance: 4.1,
    trafficDelay: 2.3,
    weatherImpact: 'medium',
    optimizationScore: 78,
    route: ['Precinct 19', 'Highway 95', 'Exit 23', 'Incident Location']
  },
  {
    id: '3',
    incidentId: '3',
    responderType: 'medical',
    units: 1,
    estimatedTime: 3.1,
    distance: 1.9,
    trafficDelay: 0.8,
    weatherImpact: 'none',
    optimizationScore: 98,
    route: ['Hospital Center', 'Park Ave', 'Central Park East', 'Incident Location']
  }
];

export const DispatchOptimizer: React.FC = () => {
  const [routes, setRoutes] = useState<DispatchRoute[]>(mockRoutes);
  const [totalUnitsDeployed, setTotalUnitsDeployed] = useState(89);
  const [avgResponseTime, setAvgResponseTime] = useState(4.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(route => ({
        ...route,
        estimatedTime: Math.max(0.5, route.estimatedTime - 0.1),
        trafficDelay: Math.max(0, route.trafficDelay - 0.05)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getResponderIcon = (type: string) => {
    switch (type) {
      case 'fire': return '🚒';
      case 'police': return '🚓';
      case 'medical': return '🚑';
      case 'hazmat': return '🚛';
      default: return '🚨';
    }
  };

  const getWeatherColor = (impact: string) => {
    switch (impact) {
      case 'none': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOptimizationColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Dispatch Optimization Engine</h2>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-slate-400">AI Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{totalUnitsDeployed}</div>
              <div className="text-sm text-slate-400">Units Deployed</div>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">12 available</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{avgResponseTime}m</div>
              <div className="text-sm text-slate-400">Avg Response</div>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">-1.2m from target</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-400">91%</div>
              <div className="text-sm text-slate-400">Route Efficiency</div>
            </div>
            <Route className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">+3% today</div>
        </div>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <div key={route.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getResponderIcon(route.responderType)}</div>
                <div>
                  <h3 className="font-semibold text-white capitalize">
                    {route.responderType} Response - {route.units} Units
                  </h3>
                  <p className="text-sm text-slate-400">Incident #{route.incidentId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getOptimizationColor(route.optimizationScore)}`}>
                  {route.optimizationScore}%
                </div>
                <div className="text-xs text-slate-400">Optimization</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{route.estimatedTime}m</div>
                <div className="text-xs text-slate-400">ETA</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-300">{route.distance}mi</div>
                <div className="text-xs text-slate-400">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-400">+{route.trafficDelay}m</div>
                <div className="text-xs text-slate-400">Traffic</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${getWeatherColor(route.weatherImpact)}`}>
                  {route.weatherImpact}
                </div>
                <div className="text-xs text-slate-400">Weather</div>
              </div>
            </div>

            <div className="bg-slate-600 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Optimized Route</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                {route.route.map((point, index) => (
                  <React.Fragment key={index}>
                    <span>{point}</span>
                    {index < route.route.length - 1 && (
                      <span className="text-slate-500">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Real-time Optimization Factors</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Traffic Data:</span>
            <span className="text-green-400 ml-2 font-medium">Live Updates</span>
          </div>
          <div>
            <span className="text-slate-400">Weather Impact:</span>
            <span className="text-blue-400 ml-2 font-medium">Clear Conditions</span>
          </div>
          <div>
            <span className="text-slate-400">Resource Availability:</span>
            <span className="text-green-400 ml-2 font-medium">Optimal</span>
          </div>
          <div>
            <span className="text-slate-400">Congestion Analysis:</span>
            <span className="text-purple-400 ml-2 font-medium">Predictive</span>
          </div>
        </div>
      </div>
    </div>
  );
};