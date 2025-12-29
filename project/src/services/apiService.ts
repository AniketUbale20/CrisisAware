import axios from 'axios';

// API Configuration
const API_CONFIG = {
  // USGS Earthquake API - Real earthquake data
  EARTHQUAKE_API: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  
  // NASA FIRMS - Fire/Wildfire data
  FIRE_API: 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/c6/world/1',
  
  // OpenWeatherMap API - Weather emergencies
  WEATHER_API: 'https://api.openweathermap.org/data/2.5/weather',
  
  // FEMA Disaster API - Federal emergency data
  FEMA_API: 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries',
  
  // CDC Emergency Response API
  CDC_API: 'https://tools.cdc.gov/api/v2/resources/media',
  
  // Traffic Incidents API (example with MapBox)
  TRAFFIC_API: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  
  // Crime Data API (example with data.gov)
  CRIME_API: 'https://api.usa.gov/crime/fbi/sapi/api/data/nibrs',
  
  // Financial Crime API (simulated - would be private banking APIs)
  FRAUD_API: '/api/fraud-detection',
  
  // Emergency Services API (simulated - would be 911 dispatch systems)
  EMERGENCY_API: '/api/emergency-services'
};

// API Keys (in production, these would be environment variables)
const API_KEYS = {
  GOOGLE_MAPS: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_API_KEY
};

// Check if API keys are properly configured
const isValidApiKey = (key: string | undefined): boolean => {
  return key && key.length > 10 && !key.includes('your_') && !key.includes('YOUR_');
};

export interface EmergencyIncident {
  id: string;
  type: 'earthquake' | 'fire' | 'flood' | 'storm' | 'accident' | 'crime' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  timestamp: Date;
  description: string;
  magnitude?: number;
  source: string;
  status: 'active' | 'monitoring' | 'resolved';
  affectedArea?: number; // radius in km
  casualties?: number;
  evacuations?: number;
}

export interface FraudAlert {
  id: string;
  type: 'atm' | 'credit' | 'wire' | 'crypto' | 'identity';
  amount: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  riskScore: number;
  timestamp: Date;
  status: 'detected' | 'investigating' | 'confirmed' | 'false-positive';
  correlationId?: string;
  source: string;
}

export interface WeatherAlert {
  id: string;
  type: 'tornado' | 'hurricane' | 'flood' | 'blizzard' | 'heatwave' | 'thunderstorm';
  severity: 'watch' | 'warning' | 'emergency';
  location: {
    lat: number;
    lng: number;
    area: string;
  };
  timestamp: Date;
  description: string;
  windSpeed?: number;
  temperature?: number;
  precipitation?: number;
}

class ApiService {
  private static instance: ApiService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    return this.cache.get(key)?.data;
  }

  // Check if Google Maps API key is valid
  public isGoogleMapsApiKeyValid(): boolean {
    return isValidApiKey(API_KEYS.GOOGLE_MAPS);
  }

  // Check if OpenWeather API key is valid
  public isOpenWeatherApiKeyValid(): boolean {
    return isValidApiKey(API_KEYS.OPENWEATHER);
  }

  // Fetch real earthquake data from USGS
  async getEarthquakeData(): Promise<EmergencyIncident[]> {
    const cacheKey = 'earthquakes';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(API_CONFIG.EARTHQUAKE_API, {
        timeout: 10000 // 10 second timeout
      });
      const earthquakes: EmergencyIncident[] = response.data.features.map((feature: any) => ({
        id: feature.id,
        type: 'earthquake' as const,
        severity: this.getEarthquakeSeverity(feature.properties.mag),
        location: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          address: feature.properties.place
        },
        timestamp: new Date(feature.properties.time),
        description: `Magnitude ${feature.properties.mag} earthquake - ${feature.properties.title}`,
        magnitude: feature.properties.mag,
        source: 'USGS',
        status: 'active' as const,
        affectedArea: Math.pow(feature.properties.mag, 2) * 10 // Rough estimate
      }));

      this.setCache(cacheKey, earthquakes);
      return earthquakes;
    } catch (error) {
      console.warn('USGS API unavailable, using mock earthquake data:', error);
      return this.getMockEarthquakeData();
    }
  }

  // Fetch weather emergency data
  async getWeatherAlerts(lat: number, lng: number): Promise<WeatherAlert[]> {
    const cacheKey = `weather_${lat}_${lng}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    // Check if OpenWeather API key is valid
    if (!this.isOpenWeatherApiKeyValid()) {
      console.warn('OpenWeatherMap API key not configured, using mock weather data');
      return this.getMockWeatherData(lat, lng);
    }

    try {
      const response = await axios.get(API_CONFIG.WEATHER_API, {
        params: {
          lat,
          lon: lng,
          appid: API_KEYS.OPENWEATHER,
          units: 'metric'
        },
        timeout: 10000 // 10 second timeout
      });

      const alerts: WeatherAlert[] = [];
      
      // Check for severe weather conditions
      if (response.data.weather) {
        response.data.weather.forEach((condition: any) => {
          if (this.isSevereWeather(condition.main)) {
            alerts.push({
              id: `weather_${Date.now()}`,
              type: this.getWeatherType(condition.main),
              severity: this.getWeatherSeverity(condition.main),
              location: {
                lat,
                lng,
                area: response.data.name
              },
              timestamp: new Date(),
              description: `${condition.main}: ${condition.description}`,
              windSpeed: response.data.wind?.speed,
              temperature: response.data.main?.temp,
              precipitation: response.data.rain?.['1h'] || response.data.snow?.['1h']
            });
          }
        });
      }

      this.setCache(cacheKey, alerts);
      return alerts;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('OpenWeatherMap API key invalid, using mock weather data');
      } else {
        console.warn('OpenWeatherMap API unavailable, using mock weather data:', error);
      }
      return this.getMockWeatherData(lat, lng);
    }
  }

  // Fetch FEMA disaster declarations
  async getFEMADisasters(): Promise<EmergencyIncident[]> {
    const cacheKey = 'fema_disasters';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(API_CONFIG.FEMA_API, {
        params: {
          $filter: `declarationDate ge ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`, // Last 30 days
          $top: 50
        },
        timeout: 15000 // 15 second timeout for FEMA API
      });

      const disasters: EmergencyIncident[] = response.data.DisasterDeclarationsSummaries.map((disaster: any) => ({
        id: disaster.disasterNumber.toString(),
        type: this.getDisasterType(disaster.incidentType),
        severity: 'high' as const,
        location: {
          lat: 0, // FEMA API doesn't provide coordinates, would need geocoding
          lng: 0,
          address: `${disaster.designatedArea}, ${disaster.state}`,
          city: disaster.designatedArea,
          state: disaster.state,
          country: 'USA'
        },
        timestamp: new Date(disaster.declarationDate),
        description: `${disaster.incidentType} - ${disaster.title}`,
        source: 'FEMA',
        status: disaster.closeoutDate ? 'resolved' : 'active'
      }));

      this.setCache(cacheKey, disasters);
      return disasters;
    } catch (error) {
      console.warn('FEMA API unavailable, using mock disaster data:', error);
      return this.getMockDisasterData();
    }
  }

  // Simulate fraud detection API (would be real banking/financial APIs)
  async getFraudAlerts(): Promise<FraudAlert[]> {
    const cacheKey = 'fraud_alerts';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    // In production, this would connect to real financial APIs
    const mockFraudData: FraudAlert[] = [
      {
        id: 'fraud_001',
        type: 'atm',
        amount: 2500,
        location: { lat: 40.7589, lng: -73.9851, address: 'Times Square, NYC' },
        riskScore: 94,
        timestamp: new Date(Date.now() - 10 * 60000),
        status: 'detected',
        source: 'Banking API'
      },
      {
        id: 'fraud_002',
        type: 'credit',
        amount: 15000,
        location: { lat: 40.7505, lng: -73.9934, address: 'Financial District, NYC' },
        riskScore: 87,
        timestamp: new Date(Date.now() - 25 * 60000),
        status: 'investigating',
        source: 'Credit Card API'
      },
      {
        id: 'fraud_003',
        type: 'wire',
        amount: 50000,
        location: { lat: 34.0522, lng: -118.2437, address: 'Downtown LA' },
        riskScore: 96,
        timestamp: new Date(Date.now() - 45 * 60000),
        status: 'confirmed',
        source: 'Wire Transfer API'
      }
    ];

    this.setCache(cacheKey, mockFraudData);
    return mockFraudData;
  }

  // Get comprehensive crisis data
  async getAllCrisisData(bounds?: google.maps.LatLngBounds): Promise<{
    incidents: EmergencyIncident[];
    fraudAlerts: FraudAlert[];
    weatherAlerts: WeatherAlert[];
  }> {
    try {
      const [earthquakes, fraudAlerts] = await Promise.all([
        this.getEarthquakeData(),
        this.getFraudAlerts()
      ]);

      // Get weather alerts for major cities if no bounds specified
      const weatherAlerts: WeatherAlert[] = [];
      if (!bounds) {
        const majorCities = [
          { lat: 40.7128, lng: -74.0060 }, // NYC
          { lat: 34.0522, lng: -118.2437 }, // LA
          { lat: 41.8781, lng: -87.6298 }, // Chicago
        ];

        for (const city of majorCities) {
          try {
            const alerts = await this.getWeatherAlerts(city.lat, city.lng);
            weatherAlerts.push(...alerts);
          } catch (error) {
            console.warn(`Failed to get weather alerts for city ${city.lat}, ${city.lng}:`, error);
          }
        }
      }

      return {
        incidents: earthquakes,
        fraudAlerts,
        weatherAlerts
      };
    } catch (error) {
      console.error('Error fetching crisis data:', error);
      return {
        incidents: this.getMockEarthquakeData(),
        fraudAlerts: await this.getFraudAlerts(),
        weatherAlerts: this.getMockWeatherData(40.7128, -74.0060)
      };
    }
  }

  // Helper methods
  private getEarthquakeSeverity(magnitude: number): 'low' | 'medium' | 'high' | 'critical' {
    if (magnitude >= 7) return 'critical';
    if (magnitude >= 5.5) return 'high';
    if (magnitude >= 4) return 'medium';
    return 'low';
  }

  private isSevereWeather(condition: string): boolean {
    const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Blizzard', 'Hail'];
    return severeConditions.some(severe => condition.includes(severe));
  }

  private getWeatherType(condition: string): WeatherAlert['type'] {
    if (condition.includes('Tornado')) return 'tornado';
    if (condition.includes('Hurricane')) return 'hurricane';
    if (condition.includes('Flood')) return 'flood';
    if (condition.includes('Snow') || condition.includes('Blizzard')) return 'blizzard';
    if (condition.includes('Thunder')) return 'thunderstorm';
    return 'thunderstorm';
  }

  private getWeatherSeverity(condition: string): WeatherAlert['severity'] {
    if (condition.includes('Severe') || condition.includes('Extreme')) return 'emergency';
    if (condition.includes('Heavy') || condition.includes('Strong')) return 'warning';
    return 'watch';
  }

  private getDisasterType(incidentType: string): EmergencyIncident['type'] {
    if (incidentType.includes('Fire')) return 'fire';
    if (incidentType.includes('Flood')) return 'flood';
    if (incidentType.includes('Storm') || incidentType.includes('Hurricane')) return 'storm';
    if (incidentType.includes('Earthquake')) return 'earthquake';
    return 'storm';
  }

  private getMockEarthquakeData(): EmergencyIncident[] {
    return [
      {
        id: 'eq_001',
        type: 'earthquake',
        severity: 'medium',
        location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
        timestamp: new Date(Date.now() - 30 * 60000),
        description: 'Magnitude 4.2 earthquake - 15km NE of Los Angeles',
        magnitude: 4.2,
        source: 'USGS (Demo)',
        status: 'active',
        affectedArea: 50
      },
      {
        id: 'eq_002',
        type: 'earthquake',
        severity: 'low',
        location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' },
        timestamp: new Date(Date.now() - 120 * 60000),
        description: 'Magnitude 3.1 earthquake - 8km SW of San Francisco',
        magnitude: 3.1,
        source: 'USGS (Demo)',
        status: 'monitoring',
        affectedArea: 20
      }
    ];
  }

  private getMockWeatherData(lat: number, lng: number): WeatherAlert[] {
    return [
      {
        id: `weather_${Date.now()}`,
        type: 'thunderstorm',
        severity: 'warning',
        location: {
          lat,
          lng,
          area: 'Metropolitan Area'
        },
        timestamp: new Date(),
        description: 'Severe thunderstorm warning - Heavy rain and strong winds expected',
        windSpeed: 25,
        temperature: 22,
        precipitation: 15
      }
    ];
  }

  private getMockDisasterData(): EmergencyIncident[] {
    return [
      {
        id: 'disaster_001',
        type: 'fire',
        severity: 'high',
        location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles County, CA' },
        timestamp: new Date(Date.now() - 60 * 60000),
        description: 'Wildfire - Major disaster declaration',
        source: 'FEMA (Demo)',
        status: 'active',
        affectedArea: 500
      }
    ];
  }
}

export default ApiService.getInstance();