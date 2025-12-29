import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmergencyMonitor } from './components/EmergencyMonitor';
import { FraudAnalytics } from './components/FraudAnalytics';
import { DispatchOptimizer } from './components/DispatchOptimizer';
import { ThreatHeatmap } from './components/ThreatHeatmap';
import { AlertsPanel } from './components/AlertsPanel';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PredictiveInsights } from './components/PredictiveInsights';
import { ResourceManager } from './components/ResourceManager';
import { CommunicationHub } from './components/CommunicationHub';
import LiveMap from './components/LiveMap';

function App() {
  const [showMap, setShowMap] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'insights' | 'resources' | 'communication'>('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    online: true,
    uptime: 99.7,
    activeAlerts: 3,
    connectedSystems: 12
  });

  useEffect(() => {
    // Simulate system status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        uptime: Math.min(99.9, prev.uptime + Math.random() * 0.1),
        activeAlerts: Math.max(0, prev.activeAlerts + (Math.random() > 0.7 ? 1 : -1))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
    setShowMap(false);
  };

  const renderMainContent = () => {
    if (showMap) {
      return (
        <main className="p-6">
          <LiveMap />
        </main>
      );
    }

    switch (activeView) {
      case 'analytics':
        return (
          <main className="p-6">
            <AnalyticsDashboard />
          </main>
        );
      case 'insights':
        return (
          <main className="p-6">
            <PredictiveInsights />
          </main>
        );
      case 'resources':
        return (
          <main className="p-6">
            <ResourceManager />
          </main>
        );
      case 'communication':
        return (
          <main className="p-6">
            <CommunicationHub />
          </main>
        );
      default:
        return (
          <main className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <EmergencyMonitor />
              </div>
              <div>
                <AlertsPanel />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FraudAnalytics />
              <DispatchOptimizer />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ThreatHeatmap />
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        onMapToggle={handleMapToggle} 
        showMap={showMap}
        activeView={activeView}
        onViewChange={handleViewChange}
        systemStatus={systemStatus}
      />
      
      {renderMainContent()}

      <footer className="bg-slate-900 border-t border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">
              CrisisAware © 2025 - Smart City Emergency Response & Fraud Detection Platform
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Powered by Machine Learning • Real-time Analytics • Geo-temporal Correlation
            </p>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span>System {systemStatus.online ? 'Online' : 'Offline'}</span>
            </div>
            <span>Uptime: {systemStatus.uptime.toFixed(1)}%</span>
            <span>Connected APIs: {systemStatus.connectedSystems}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;