import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, Zap, Clock, Users, DollarSign, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
  timeRange: '1h' | '24h' | '7d' | '30d';
  incidents: {
    total: number;
    trend: number;
    byType: { [key: string]: number };
    bySeverity: { [key: string]: number };
  };
  fraud: {
    total: number;
    amount: number;
    prevented: number;
    trend: number;
  };
  response: {
    avgTime: number;
    efficiency: number;
    resourceUtilization: number;
  };
  correlation: {
    score: number;
    patterns: number;
    accuracy: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    timeRange: '24h',
    incidents: {
      total: 247,
      trend: 12.5,
      byType: {
        fire: 45,
        medical: 89,
        accident: 67,
        security: 32,
        earthquake: 14
      },
      bySeverity: {
        critical: 23,
        high: 67,
        medium: 98,
        low: 59
      }
    },
    fraud: {
      total: 156,
      amount: 2840000,
      prevented: 2650000,
      trend: -8.3
    },
    response: {
      avgTime: 4.2,
      efficiency: 94.7,
      resourceUtilization: 78.3
    },
    correlation: {
      score: 87.4,
      patterns: 34,
      accuracy: 92.1
    }
  });

  useEffect(() => {
    // Simulate real-time analytics updates
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        incidents: {
          ...prev.incidents,
          total: prev.incidents.total + Math.floor(Math.random() * 3),
          trend: prev.incidents.trend + (Math.random() - 0.5) * 2
        },
        fraud: {
          ...prev.fraud,
          total: prev.fraud.total + Math.floor(Math.random() * 2),
          amount: prev.fraud.amount + Math.floor(Math.random() * 50000)
        },
        response: {
          ...prev.response,
          avgTime: Math.max(2, prev.response.avgTime + (Math.random() - 0.5) * 0.5),
          efficiency: Math.min(99, Math.max(80, prev.response.efficiency + (Math.random() - 0.5) * 2))
        }
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Comprehensive crisis management analytics and insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Time Range:</span>
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(analytics.incidents.trend)}`}>
              {getTrendIcon(analytics.incidents.trend)}
              <span className="text-sm font-medium">{Math.abs(analytics.incidents.trend).toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{analytics.incidents.total}</div>
          <div className="text-sm text-slate-400">Total Incidents</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(analytics.fraud.trend)}`}>
              {getTrendIcon(analytics.fraud.trend)}
              <span className="text-sm font-medium">{Math.abs(analytics.fraud.trend).toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{analytics.fraud.total}</div>
          <div className="text-sm text-slate-400">Fraud Attempts</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-green-400 text-sm font-medium">Optimal</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{analytics.response.avgTime}m</div>
          <div className="text-sm text-slate-400">Avg Response Time</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-blue-400 text-sm font-medium">Excellent</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{analytics.response.efficiency}%</div>
          <div className="text-sm text-slate-400">System Efficiency</div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Incident Breakdown</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(analytics.incidents.byType).map(([type, count]) => {
              const percentage = (count / analytics.incidents.total) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 capitalize">{type}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fraud Prevention Impact */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span>Fraud Prevention Impact</span>
          </h3>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {formatCurrency(analytics.fraud.prevented)}
              </div>
              <div className="text-sm text-slate-400">Total Amount Prevented</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{formatCurrency(analytics.fraud.amount)}</div>
                <div className="text-xs text-slate-400">Attempted</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {((analytics.fraud.prevented / analytics.fraud.amount) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">Prevention Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Correlation Analysis */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>AI Correlation</span>
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{analytics.correlation.score}%</div>
              <div className="text-sm text-slate-400">Correlation Score</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Patterns Detected</span>
                <span className="text-white font-medium">{analytics.correlation.patterns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Accuracy Rate</span>
                <span className="text-green-400 font-medium">{analytics.correlation.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Resource Usage</span>
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{analytics.response.resourceUtilization}%</div>
              <div className="text-sm text-slate-400">Utilization Rate</div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics.response.resourceUtilization}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-slate-400 text-center">
              Optimal range: 70-85%
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Performance</span>
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">API Response</span>
                <span className="text-green-400 font-medium">98ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Data Accuracy</span>
                <span className="text-green-400 font-medium">99.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">System Load</span>
                <span className="text-yellow-400 font-medium">67%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Error Rate</span>
                <span className="text-green-400 font-medium">0.03%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};