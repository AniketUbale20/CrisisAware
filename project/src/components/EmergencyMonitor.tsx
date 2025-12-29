import React, { useState, useEffect } from 'react';
import { Flame, Car, Heart, Shield, MapPin, Clock } from 'lucide-react';

interface Incident {
  id: string;
  type: 'fire' | 'accident' | 'medical' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: [number, number];
  timestamp: Date;
  description: string;
  status: 'reported' | 'dispatched' | 'responding' | 'resolved';
  responders: number;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'fire',
    severity: 'critical',
    location: 'Downtown Financial District',
    coordinates: [40.7128, -74.0060],
    timestamp: new Date(Date.now() - 5 * 60000),
    description: 'Structure fire reported at 42nd & Broadway',
    status: 'responding',
    responders: 12
  },
  {
    id: '2',
    type: 'accident',
    severity: 'high',
    location: 'Highway 95 North',
    coordinates: [40.7580, -73.9855],
    timestamp: new Date(Date.now() - 12 * 60000),
    description: 'Multi-vehicle collision blocking 2 lanes',
    status: 'dispatched',
    responders: 8
  },
  {
    id: '3',
    type: 'medical',
    severity: 'medium',
    location: 'Central Park East',
    coordinates: [40.7794, -73.9632],
    timestamp: new Date(Date.now() - 8 * 60000),
    description: 'Cardiac emergency - elderly male',
    status: 'responding',
    responders: 4
  },
  {
    id: '4',
    type: 'security',
    severity: 'low',
    location: 'Times Square',
    coordinates: [40.7580, -73.9855],
    timestamp: new Date(Date.now() - 20 * 60000),
    description: 'Suspicious package reported',
    status: 'resolved',
    responders: 6
  }
];

export const EmergencyMonitor: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents(prev => prev.map(incident => ({
        ...incident,
        timestamp: incident.timestamp
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="w-5 h-5" />;
      case 'accident': return <Car className="w-5 h-5" />;
      case 'medical': return <Heart className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'text-red-400';
      case 'dispatched': return 'text-amber-400';
      case 'responding': return 'text-blue-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    return `${minutes}m ago`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Live Emergency Monitor</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live Feed</span>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(incident.severity)}`}>
                  {getIncidentIcon(incident.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white capitalize">{incident.type} Incident</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{incident.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{incident.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(incident.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(incident.status)}`}>
                  {incident.status.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {incident.responders} responders
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">12</div>
          <div className="text-xs text-slate-400">Critical</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">28</div>
          <div className="text-xs text-slate-400">High Priority</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">156</div>
          <div className="text-xs text-slate-400">Resolved Today</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">4.2m</div>
          <div className="text-xs text-slate-400">Avg Response</div>
        </div>
      </div>
    </div>
  );
};