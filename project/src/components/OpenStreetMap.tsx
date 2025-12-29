import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Flame, Car, Heart, Shield, AlertTriangle, CreditCard, DollarSign, TrendingUp, Cloud, Zap, MapPin, Activity } from 'lucide-react';
import ApiService, { EmergencyIncident, FraudAlert, WeatherAlert } from '../services/apiService';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  onIncidentSelect?: (incident: EmergencyIncident | null) => void;
  onFraudSelect?: (fraud: FraudAlert | null) => void;
  showIncidents?: boolean;
  showFraud?: boolean;
  showWeather?: boolean;
  showTraffic?: boolean;
}

// Custom marker icons
const createCustomIcon = (color: string, IconComponent: React.ComponentType<any>) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          ${getIconSVG(IconComponent)}
        </svg>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Helper function to get SVG path for icons
const getIconSVG = (IconComponent: React.ComponentType<any>) => {
  const iconMap: { [key: string]: string } = {
    'Flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'Car': '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10H5.6L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m0 0a2 2 0 1 0 4 0m10 0a2 2 0 1 0 4 0M7 8l4-5 4 5"/>',
    'Heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>',
    'Shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'DollarSign': '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    'Cloud': '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    'TrendingUp': '<polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/>',
    'AlertTriangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="m12 17 .01 0"/>'
  };
  
  return iconMap[IconComponent.name] || iconMap['AlertTriangle'];
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  onIncidentSelect,
  onFraudSelect,
  showIncidents = true,
  showFraud = true,
  showWeather = true,
  showTraffic = true
}) => {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch crisis data
  const fetchCrisisData = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAllCrisisData();
      setIncidents(data.incidents);
      setFraudAlerts(data.fraudAlerts);
      setWeatherAlerts(data.weatherAlerts);
    } catch (error) {
      console.error('Error fetching crisis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrisisData();
    const interval = setInterval(fetchCrisisData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get incident icon and color
  const getIncidentIcon = (type: string, severity: string) => {
    const icons = {
      fire: Flame,
      earthquake: TrendingUp,
      flood: Cloud,
      storm: Zap,
      accident: Car,
      crime: Shield,
      medical: Heart
    };
    
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#22c55e'
    };
    
    const IconComponent = icons[type as keyof typeof icons] || AlertTriangle;
    const color = colors[severity as keyof typeof colors] || colors.medium;
    
    return { IconComponent, color };
  };

  // Get fraud icon and color
  const getFraudIcon = (riskScore: number) => {
    const color = riskScore >= 90 ? '#ef4444' : riskScore >= 75 ? '#f97316' : '#eab308';
    return { IconComponent: DollarSign, color };
  };

  // Get weather icon and color
  const getWeatherIcon = (severity: string) => {
    const colors = {
      emergency: '#dc2626',
      warning: '#ea580c',
      watch: '#ca8a04'
    };
    
    const color = colors[severity as keyof typeof colors] || colors.watch;
    return { IconComponent: Cloud, color };
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[40.7128, -74.0060]} // NYC coordinates
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* OpenStreetMap tiles - completely free */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Emergency Incident Markers */}
        {showIncidents && incidents.map((incident) => {
          const { IconComponent, color } = getIncidentIcon(incident.type, incident.severity);
          return (
            <Marker
              key={incident.id}
              position={[incident.location.lat, incident.location.lng]}
              icon={createCustomIcon(color, IconComponent)}
              eventHandlers={{
                click: () => {
                  onIncidentSelect?.(incident);
                }
              }}
            >
              <Popup>
                <div className="max-w-sm">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {incident.type.toUpperCase()} - {incident.severity.toUpperCase()}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Location:</strong> {incident.location.address || 'Unknown'}</p>
                    <p><strong>Time:</strong> {incident.timestamp.toLocaleString()}</p>
                    <p><strong>Description:</strong> {incident.description}</p>
                    {incident.magnitude && <p><strong>Magnitude:</strong> {incident.magnitude}</p>}
                    <p><strong>Source:</strong> {incident.source}</p>
                    <p><strong>Status:</strong> {incident.status}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Fraud Alert Markers */}
        {showFraud && fraudAlerts.map((fraud) => {
          const { IconComponent, color } = getFraudIcon(fraud.riskScore);
          return (
            <Marker
              key={fraud.id}
              position={[fraud.location.lat, fraud.location.lng]}
              icon={createCustomIcon(color, IconComponent)}
              eventHandlers={{
                click: () => {
                  onFraudSelect?.(fraud);
                }
              }}
            >
              <Popup>
                <div className="max-w-sm">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {fraud.type.toUpperCase()} FRAUD ALERT
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Amount:</strong> ${fraud.amount.toLocaleString()}</p>
                    <p><strong>Risk Score:</strong> {fraud.riskScore}%</p>
                    <p><strong>Location:</strong> {fraud.location.address || 'Unknown'}</p>
                    <p><strong>Time:</strong> {fraud.timestamp.toLocaleString()}</p>
                    <p><strong>Status:</strong> {fraud.status}</p>
                    <p><strong>Source:</strong> {fraud.source}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Weather Alert Markers */}
        {showWeather && weatherAlerts.map((alert) => {
          const { IconComponent, color } = getWeatherIcon(alert.severity);
          return (
            <Marker
              key={alert.id}
              position={[alert.location.lat, alert.location.lng]}
              icon={createCustomIcon(color, IconComponent)}
            >
              <Popup>
                <div className="max-w-sm">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {alert.type.toUpperCase()} {alert.severity.toUpperCase()}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Area:</strong> {alert.location.area}</p>
                    <p><strong>Description:</strong> {alert.description}</p>
                    <p><strong>Time:</strong> {alert.timestamp.toLocaleString()}</p>
                    {alert.windSpeed && <p><strong>Wind Speed:</strong> {alert.windSpeed} m/s</p>}
                    {alert.temperature && <p><strong>Temperature:</strong> {alert.temperature}°C</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-4 bg-slate-800/90 text-white px-3 py-2 rounded-lg flex items-center space-x-2 z-[1000]">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading crisis data...</span>
        </div>
      )}
      
      {/* Map Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-lg flex items-center space-x-2 z-[1000]">
        <MapPin className="w-4 h-4 text-green-600" />
        <span className="text-xs text-gray-700">OpenStreetMap - Free & Open Source</span>
      </div>
    </div>
  );
};

export default OpenStreetMap;