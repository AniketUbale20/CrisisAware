import React from 'react';
import { Shield, AlertTriangle, Activity, Map, Satellite, Navigation, BarChart3, Brain, Users, MessageSquare, Zap } from 'lucide-react';

interface SystemStatus {
  online: boolean;
  uptime: number;
  activeAlerts: number;
  connectedSystems: number;
}

interface HeaderProps {
  onMapToggle: () => void;
  showMap: boolean;
  activeView: 'dashboard' | 'analytics' | 'insights' | 'resources' | 'communication';
  onViewChange: (view: 'dashboard' | 'analytics' | 'insights' | 'resources' | 'communication') => void;
  systemStatus: SystemStatus;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMapToggle, 
  showMap, 
  activeView, 
  onViewChange, 
  systemStatus 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'communication', label: 'Comms', icon: MessageSquare }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              CrisisAware
            </h1>
            <p className="text-sm text-slate-400">Smart City Response Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                  {isActive && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>}
                </button>
              );
            })}
            
            <div className="w-px h-8 bg-slate-600 mx-2"></div>
            
            <button
              onClick={onMapToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showMap 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white hover:scale-105'
              }`}
            >
              {showMap ? <Satellite className="w-4 h-4" /> : <Map className="w-4 h-4" />}
              <span className="hidden md:block">{showMap ? 'Live Map' : 'Open Map'}</span>
              {showMap && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>}
            </button>
          </nav>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${systemStatus.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-slate-300">System {systemStatus.online ? 'Online' : 'Offline'}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">{systemStatus.activeAlerts} Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">{systemStatus.uptime.toFixed(1)}% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{systemStatus.connectedSystems} APIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};