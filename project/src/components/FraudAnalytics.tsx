import React, { useState, useEffect } from 'react';
import { TrendingUp, CreditCard, DollarSign, AlertCircle, Eye, Target } from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'atm' | 'credit' | 'crypto' | 'wire';
  amount: number;
  location: string;
  riskScore: number;
  timestamp: Date;
  status: 'detected' | 'investigating' | 'confirmed' | 'false-positive';
  correlation?: string;
}

const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    type: 'atm',
    amount: 2400,
    location: 'Downtown Financial - ATM #4521',
    riskScore: 94,
    timestamp: new Date(Date.now() - 3 * 60000),
    status: 'detected',
    correlation: 'Power outage in vicinity detected 2 minutes prior'
  },
  {
    id: '2',
    type: 'credit',
    amount: 15600,
    location: 'Online Transaction - IP: 192.168.1.1',
    riskScore: 87,
    timestamp: new Date(Date.now() - 8 * 60000),
    status: 'investigating'
  },
  {
    id: '3',
    type: 'crypto',
    amount: 45000,
    location: 'Cryptocurrency Exchange',
    riskScore: 92,
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'confirmed',
    correlation: 'Emergency dispatch activity in same geo-zone'
  },
  {
    id: '4',
    type: 'wire',
    amount: 8900,
    location: 'International Wire Transfer',
    riskScore: 76,
    timestamp: new Date(Date.now() - 25 * 60000),
    status: 'false-positive'
  }
];

export const FraudAnalytics: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [totalDetected, setTotalDetected] = useState(1247);
  const [amountSaved, setAmountSaved] = useState(2840000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalDetected(prev => prev + Math.floor(Math.random() * 3));
      setAmountSaved(prev => prev + Math.floor(Math.random() * 10000));
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'atm': return <CreditCard className="w-5 h-5" />;
      case 'credit': return <CreditCard className="w-5 h-5" />;
      case 'crypto': return <TrendingUp className="w-5 h-5" />;
      case 'wire': return <DollarSign className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-400 bg-red-400/10';
    if (score >= 75) return 'text-orange-400 bg-orange-400/10';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-red-400';
      case 'investigating': return 'text-amber-400';
      case 'confirmed': return 'text-red-500';
      case 'false-positive': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    return `${minutes}m ago`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Fraud Detection Analytics</h2>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-400">AI Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-400">{totalDetected}</div>
              <div className="text-sm text-slate-400">Fraud Attempts</div>
            </div>
            <Target className="w-8 h-8 text-red-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">+12 today</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{formatAmount(amountSaved)}</div>
              <div className="text-sm text-slate-400">Amount Saved</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">+$45K today</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">96.7%</div>
              <div className="text-sm text-slate-400">Detection Rate</div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-xs text-green-400 mt-1">+2.1% this week</div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                  {getTypeIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-white capitalize">{alert.type} Fraud</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(alert.riskScore)}`}>
                      Risk: {alert.riskScore}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{alert.location}</p>
                  {alert.correlation && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mb-2">
                      <p className="text-amber-400 text-xs">
                        <strong>Correlation Alert:</strong> {alert.correlation}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-slate-400">{getTimeAgo(alert.timestamp)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white mb-1">
                  {formatAmount(alert.amount)}
                </div>
                <div className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                  {alert.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-2">ML Pattern Analysis</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Emergency-Fraud Correlation:</span>
            <span className="text-green-400 ml-2 font-medium">87% accuracy</span>
          </div>
          <div>
            <span className="text-slate-400">Geo-Temporal Matching:</span>
            <span className="text-blue-400 ml-2 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};