import React, { useState, useEffect } from 'react';
import { Users, Truck, Heart, Shield, Flame, MapPin, Clock, Battery, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

interface Resource {
  id: string;
  type: 'fire' | 'police' | 'medical' | 'hazmat' | 'rescue';
  unitId: string;
  status: 'available' | 'dispatched' | 'busy' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  crew: number;
  equipment: string[];
  lastUpdate: Date;
  currentIncident?: string;
  eta?: number;
  batteryLevel?: number;
  fuelLevel?: number;
}

interface Deployment {
  id: string;
  incidentId: string;
  incidentType: string;
  location: string;
  assignedUnits: string[];
  status: 'planning' | 'dispatched' | 'active' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: number;
  actualDuration?: number;
}

export const ResourceManager: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'fire',
      unitId: 'Engine-14',
      status: 'available',
      location: { lat: 40.7128, lng: -74.0060, address: 'Fire Station 14, Downtown' },
      crew: 4,
      equipment: ['Ladder', 'Hose', 'Oxygen Tanks', 'Rescue Tools'],
      lastUpdate: new Date(),
      batteryLevel: 95,
      fuelLevel: 78
    },
    {
      id: '2',
      type: 'police',
      unitId: 'Patrol-23',
      status: 'dispatched',
      location: { lat: 40.7589, lng: -73.9851, address: 'Times Square Area' },
      crew: 2,
      equipment: ['Radio', 'First Aid', 'Traffic Control'],
      lastUpdate: new Date(Date.now() - 5 * 60000),
      currentIncident: 'INC-2024-001',
      eta: 3,
      batteryLevel: 87,
      fuelLevel: 65
    },
    {
      id: '3',
      type: 'medical',
      unitId: 'Ambulance-07',
      status: 'busy',
      location: { lat: 40.7794, lng: -73.9632, address: 'Central Park East' },
      crew: 3,
      equipment: ['Defibrillator', 'Oxygen', 'Stretcher', 'Medical Supplies'],
      lastUpdate: new Date(Date.now() - 12 * 60000),
      currentIncident: 'INC-2024-002',
      batteryLevel: 92,
      fuelLevel: 45
    },
    {
      id: '4',
      type: 'hazmat',
      unitId: 'HAZMAT-01',
      status: 'maintenance',
      location: { lat: 40.7505, lng: -73.9934, address: 'Emergency Services Depot' },
      crew: 0,
      equipment: ['Chemical Suits', 'Detection Equipment', 'Containment Gear'],
      lastUpdate: new Date(Date.now() - 2 * 60 * 60000),
      batteryLevel: 100,
      fuelLevel: 100
    }
  ]);

  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      incidentId: 'INC-2024-001',
      incidentType: 'Structure Fire',
      location: 'Downtown Financial District',
      assignedUnits: ['Engine-14', 'Ladder-08', 'Rescue-03'],
      status: 'active',
      priority: 'critical',
      estimatedDuration: 120,
      actualDuration: 45
    },
    {
      id: '2',
      incidentId: 'INC-2024-002',
      incidentType: 'Medical Emergency',
      location: 'Central Park East',
      assignedUnits: ['Ambulance-07'],
      status: 'active',
      priority: 'high',
      estimatedDuration: 60,
      actualDuration: 25
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'deployed' | 'maintenance'>('all');

  useEffect(() => {
    // Simulate real-time resource updates
    const interval = setInterval(() => {
      setResources(prev => prev.map(resource => ({
        ...resource,
        batteryLevel: Math.max(20, resource.batteryLevel! - Math.random() * 2),
        fuelLevel: Math.max(10, resource.fuelLevel! - Math.random() * 1.5),
        lastUpdate: new Date()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="w-5 h-5" />;
      case 'police': return <Shield className="w-5 h-5" />;
      case 'medical': return <Heart className="w-5 h-5" />;
      case 'hazmat': return <AlertTriangle className="w-5 h-5" />;
      case 'rescue': return <Users className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'dispatched': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'busy': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'offline': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-400';
    if (level > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredResources = resources.filter(resource => {
    switch (selectedFilter) {
      case 'available': return resource.status === 'available';
      case 'deployed': return resource.status === 'dispatched' || resource.status === 'busy';
      case 'maintenance': return resource.status === 'maintenance' || resource.status === 'offline';
      default: return true;
    }
  });

  const resourceStats = {
    total: resources.length,
    available: resources.filter(r => r.status === 'available').length,
    deployed: resources.filter(r => r.status === 'dispatched' || r.status === 'busy').length,
    maintenance: resources.filter(r => r.status === 'maintenance' || r.status === 'offline').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-400" />
            <span>Resource Management</span>
          </h1>
          <p className="text-slate-400">Real-time tracking and deployment of emergency resources</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Filter:</span>
          {['all', 'available', 'deployed', 'maintenance'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-blue-400 text-sm font-medium">Total</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{resourceStats.total}</div>
          <div className="text-sm text-slate-400">Emergency Units</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-green-400 text-sm font-medium">Ready</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{resourceStats.available}</div>
          <div className="text-sm text-slate-400">Available Units</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Navigation className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-orange-400 text-sm font-medium">Active</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{resourceStats.deployed}</div>
          <div className="text-sm text-slate-400">Deployed Units</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-yellow-400 text-sm font-medium">Maintenance</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{resourceStats.maintenance}</div>
          <div className="text-sm text-slate-400">Out of Service</div>
        </div>
      </div>

      {/* Active Deployments */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-orange-400" />
          <span>Active Deployments</span>
        </h3>
        
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-white">{deployment.incidentType}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(deployment.priority)}`}>
                    {deployment.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  Duration: {deployment.actualDuration}m / {deployment.estimatedDuration}m
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Location</div>
                  <div className="text-white">{deployment.location}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Assigned Units</div>
                  <div className="text-white">{deployment.assignedUnits.join(', ')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(deployment.status)}`}>
                    {deployment.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource List */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-400" />
          <span>Resource Fleet</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(resource.status)}`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{resource.unitId}</h4>
                    <p className="text-sm text-slate-400 capitalize">{resource.type} Unit</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(resource.status)}`}>
                  {resource.status.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{resource.location.address}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">Crew: {resource.crew}</span>
                  {resource.eta && (
                    <>
                      <Clock className="w-4 h-4 text-blue-400 ml-4" />
                      <span className="text-blue-400">ETA: {resource.eta}m</span>
                    </>
                  )}
                </div>

                {resource.batteryLevel && resource.fuelLevel && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Battery</span>
                        <span className={getBatteryColor(resource.batteryLevel)}>{resource.batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${resource.batteryLevel > 50 ? 'bg-green-400' : resource.batteryLevel > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${resource.batteryLevel}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Fuel</span>
                        <span className={getBatteryColor(resource.fuelLevel)}>{resource.fuelLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${resource.fuelLevel > 50 ? 'bg-green-400' : resource.fuelLevel > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${resource.fuelLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-600">
                  <div className="text-xs text-slate-400 mb-1">Equipment</div>
                  <div className="flex flex-wrap gap-1">
                    {resource.equipment.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">
                        {item}
                      </span>
                    ))}
                    {resource.equipment.length > 3 && (
                      <span className="px-2 py-1 bg-slate-600 text-xs text-slate-400 rounded">
                        +{resource.equipment.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};