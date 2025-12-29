import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Clock, Zap } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'emergency' | 'fraud' | 'system' | 'correlation';
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  priority: number;
  source: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    category: 'correlation',
    title: 'High-Risk Correlation Detected',
    description: 'ATM fraud spike detected 3 minutes after power outage in Financial District',
    timestamp: new Date(Date.now() - 2 * 60000),
    acknowledged: false,
    priority: 1,
    source: 'ML Correlation Engine'
  },
  {
    id: '2',
    type: 'critical',
    category: 'emergency',
    title: 'Structure Fire - Multiple Units Dispatched',
    description: 'Large structure fire at 42nd & Broadway requires additional resources',
    timestamp: new Date(Date.now() - 5 * 60000),
    acknowledged: false,
    priority: 1,
    source: 'Emergency Dispatch'
  },
  {
    id: '3',
    type: 'warning',
    category: 'fraud',
    title: 'Cryptocurrency Transaction Anomaly',
    description: 'Unusual crypto trading pattern detected - $45K transaction during emergency',
    timestamp: new Date(Date.now() - 8 * 60000),
    acknowledged: false,
    priority: 2,
    source: 'Fraud Detection AI'
  },
  {
    id: '4',
    type: 'info',
    category: 'system',
    title: 'System Performance Update',
    description: 'All monitoring systems operating at 98.7% efficiency',
    timestamp: new Date(Date.now() - 15 * 60000),
    acknowledged: true,
    priority: 3,
    source: 'System Monitor'
  },
  {
    id: '5',
    type: 'success',
    category: 'emergency',
    title: 'Incident Resolved',
    description: 'Security incident at Times Square successfully resolved',
    timestamp: new Date(Date.now() - 20 * 60000),
    acknowledged: true,
    priority: 3,
    source: 'Emergency Response'
  }
];

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'critical'>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts occasionally
      if (Math.random() > 0.95) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'critical' : 'warning',
          category: ['emergency', 'fraud', 'correlation'][Math.floor(Math.random() * 3)] as any,
          title: 'New Alert Detected',
          description: 'System has detected a new event requiring attention',
          timestamp: new Date(),
          acknowledged: false,
          priority: Math.random() > 0.5 ? 1 : 2,
          source: 'Automated System'
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Bell className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string, acknowledged: boolean) => {
    const opacity = acknowledged ? '40' : '100';
    switch (type) {
      case 'critical': return `text-red-4${opacity} bg-red-500/10 border-red-500/20`;
      case 'warning': return `text-orange-4${opacity} bg-orange-500/10 border-orange-500/20`;
      case 'info': return `text-blue-4${opacity} bg-blue-500/10 border-blue-500/20`;
      case 'success': return `text-green-4${opacity} bg-green-500/10 border-green-500/20`;
      default: return `text-gray-4${opacity} bg-gray-500/10 border-gray-500/20`;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'correlation': return <Zap className="w-3 h-3" />;
      case 'emergency': return <AlertTriangle className="w-3 h-3" />;
      case 'fraud': return <Bell className="w-3 h-3" />;
      case 'system': return <CheckCircle className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    return `${minutes}m ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unacknowledged': return !alert.acknowledged;
      case 'critical': return alert.type === 'critical';
      default: return true;
    }
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-white">Alert Management</h2>
          {unacknowledgedCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unacknowledgedCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live Monitoring</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-slate-400">Filter:</span>
        {['all', 'unacknowledged', 'critical'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption as any)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === filterOption 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {filterOption === 'all' ? 'All Alerts' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`rounded-lg border p-4 transition-all duration-200 ${getAlertColor(alert.type, alert.acknowledged)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${alert.acknowledged ? 'opacity-40' : ''}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-semibold ${alert.acknowledged ? 'text-slate-400' : 'text-white'}`}>
                      {alert.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(alert.category)}
                      <span className="text-xs text-slate-400 capitalize">{alert.category}</span>
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${alert.acknowledged ? 'text-slate-500' : 'text-slate-300'}`}>
                    {alert.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(alert.timestamp)}</span>
                    </div>
                    <span>Source: {alert.source}</span>
                    <span>Priority: {alert.priority}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-red-400">
            {alerts.filter(a => a.type === 'critical').length}
          </div>
          <div className="text-xs text-slate-400">Critical</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-orange-400">
            {alerts.filter(a => a.type === 'warning').length}
          </div>
          <div className="text-xs text-slate-400">Warning</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-400">
            {alerts.filter(a => a.type === 'info').length}
          </div>
          <div className="text-xs text-slate-400">Info</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-green-400">
            {alerts.filter(a => a.acknowledged).length}
          </div>
          <div className="text-xs text-slate-400">Resolved</div>
        </div>
      </div>
    </div>
  );
};