import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Clock, MapPin, Activity, BarChart3, Eye } from 'lucide-react';

interface Prediction {
  id: string;
  type: 'incident' | 'fraud' | 'resource' | 'correlation';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
  location?: string;
  recommendedActions: string[];
}

interface MLModel {
  name: string;
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'updating';
  predictions: number;
}

export const PredictiveInsights: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: '1',
      type: 'incident',
      title: 'Increased Fire Risk - Downtown Area',
      description: 'Weather conditions and historical patterns suggest elevated fire risk in the downtown financial district',
      probability: 78,
      timeframe: 'Next 6 hours',
      impact: 'high',
      confidence: 85,
      factors: ['Dry weather conditions', 'High wind speeds', 'Historical incident patterns', 'Building density'],
      location: 'Financial District',
      recommendedActions: [
        'Increase fire department readiness',
        'Deploy additional units to high-risk areas',
        'Issue public safety advisory'
      ]
    },
    {
      id: '2',
      type: 'fraud',
      title: 'ATM Fraud Spike Prediction',
      description: 'ML models predict a 65% increase in ATM fraud attempts during the upcoming weekend',
      probability: 92,
      timeframe: 'Next 48 hours',
      impact: 'medium',
      confidence: 91,
      factors: ['Weekend patterns', 'Recent security incidents', 'Economic indicators', 'Tourist activity'],
      location: 'Tourist Areas',
      recommendedActions: [
        'Enhance ATM monitoring',
        'Deploy additional security personnel',
        'Activate fraud detection algorithms'
      ]
    },
    {
      id: '3',
      type: 'correlation',
      title: 'Emergency-Fraud Correlation Event',
      description: 'High probability of coordinated fraud attempts during predicted emergency response activities',
      probability: 73,
      timeframe: 'Next 12 hours',
      impact: 'critical',
      confidence: 88,
      factors: ['Historical correlation patterns', 'Current emergency activity', 'Resource deployment', 'Communication patterns'],
      recommendedActions: [
        'Activate correlation monitoring',
        'Cross-reference emergency and fraud systems',
        'Alert financial institutions'
      ]
    },
    {
      id: '4',
      type: 'resource',
      title: 'Resource Shortage Warning',
      description: 'Predicted shortage of emergency medical units in the northern district',
      probability: 67,
      timeframe: 'Next 4 hours',
      impact: 'high',
      confidence: 79,
      factors: ['Current deployment levels', 'Historical demand patterns', 'Traffic conditions', 'Weather impact'],
      location: 'Northern District',
      recommendedActions: [
        'Redistribute medical units',
        'Place backup units on standby',
        'Coordinate with neighboring districts'
      ]
    }
  ]);

  const [mlModels, setMLModels] = useState<MLModel[]>([
    {
      name: 'Emergency Prediction Engine',
      accuracy: 94.7,
      lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictions: 1247
    },
    {
      name: 'Fraud Detection AI',
      accuracy: 96.2,
      lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictions: 2156
    },
    {
      name: 'Correlation Analysis Model',
      accuracy: 87.4,
      lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'training',
      predictions: 834
    },
    {
      name: 'Resource Optimization AI',
      accuracy: 91.8,
      lastTrained: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'active',
      predictions: 567
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  useEffect(() => {
    // Simulate real-time prediction updates
    const interval = setInterval(() => {
      setPredictions(prev => prev.map(prediction => ({
        ...prediction,
        probability: Math.max(10, Math.min(99, prediction.probability + (Math.random() - 0.5) * 5)),
        confidence: Math.max(60, Math.min(99, prediction.confidence + (Math.random() - 0.5) * 3))
      })));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incident': return <AlertTriangle className="w-5 h-5" />;
      case 'fraud': return <Target className="w-5 h-5" />;
      case 'correlation': return <Zap className="w-5 h-5" />;
      case 'resource': return <Activity className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'training': return 'text-yellow-400';
      case 'updating': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <span>AI Predictive Insights</span>
          </h1>
          <p className="text-slate-400">Machine learning powered predictions and recommendations</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Prediction Range:</span>
          {['1h', '6h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeframe(range as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === range 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ML Model Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mlModels.map((model) => (
          <div key={model.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div className={`text-sm font-medium ${getModelStatusColor(model.status)}`}>
                {model.status.toUpperCase()}
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm mb-2">{model.name}</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy:</span>
                <span className="text-green-400 font-medium">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Predictions:</span>
                <span className="text-white font-medium">{model.predictions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span>Active Predictions</span>
        </h2>
        
        {predictions.map((prediction) => (
          <div key={prediction.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getImpactColor(prediction.impact)}`}>
                  {getTypeIcon(prediction.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{prediction.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{prediction.description}</p>
                  {prediction.location && (
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{prediction.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">{prediction.probability}%</div>
                <div className="text-sm text-slate-400">Probability</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">{prediction.timeframe}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contributing Factors */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-yellow-400" />
                  <span>Contributing Factors</span>
                </h4>
                <div className="space-y-2">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Recommended Actions</span>
                </h4>
                <div className="space-y-2">
                  {prediction.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span className="text-slate-300">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Confidence Level</span>
                <span className="text-sm font-medium text-white">{prediction.confidence}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <span>AI Performance Overview</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
            <div className="text-sm text-slate-400">Overall Accuracy</div>
            <div className="text-xs text-green-400 mt-1">+2.1% this week</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">4,804</div>
            <div className="text-sm text-slate-400">Predictions Made</div>
            <div className="text-xs text-blue-400 mt-1">+156 today</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">87.6%</div>
            <div className="text-sm text-slate-400">Action Success Rate</div>
            <div className="text-xs text-purple-400 mt-1">Based on recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
};