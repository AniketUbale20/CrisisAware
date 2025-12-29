import React, { useState } from 'react';
import { Map, Layers, Eye, EyeOff, Activity, DollarSign, Cloud, Car } from 'lucide-react';
import OpenStreetMap from './OpenStreetMap';
import { EmergencyIncident, FraudAlert } from '../services/apiService';

interface LiveMapProps {
  onIncidentSelect?: (incident: EmergencyIncident | null) => void;
  onFraudSelect?: (fraud: FraudAlert | null) => void;
}

const LiveMap: React.FC<LiveMapProps> = ({ onIncidentSelect, onFraudSelect }) => {
  const [showIncidents, setShowIncidents] = useState(true);
  const [showFraud, setShowFraud] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Crisis Map</h2>
              <p className="text-slate-300 text-sm">Real-time emergency and fraud monitoring</p>
            </div>
          </div>
          
          {/* Layer Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showIncidents 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {showIncidents ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Activity className="w-4 h-4" />
              <span>Incidents</span>
            </button>
            
            <button
              onClick={() => setShowFraud(!showFraud)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFraud 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {showFraud ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <DollarSign className="w-4 h-4" />
              <span>Fraud</span>
            </button>
            
            <button
              onClick={() => setShowWeather(!showWeather)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showWeather 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {showWeather ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Cloud className="w-4 h-4" />
              <span>Weather</span>
            </button>
            
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showTraffic 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {showTraffic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Car className="w-4 h-4" />
              <span>Traffic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[600px] relative">
        <OpenStreetMap
          onIncidentSelect={onIncidentSelect}
          onFraudSelect={onFraudSelect}
          showIncidents={showIncidents}
          showFraud={showFraud}
          showWeather={showWeather}
          showTraffic={showTraffic}
        />
      </div>

      {/* Legend */}
      <div className="bg-slate-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-slate-600">High Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Low</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <Layers className="w-4 h-4" />
              <span>Powered by OpenStreetMap</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;