const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const ChargingStation = require('./models/ChargingStation');

dotenv.config({ path: path.join(__dirname, '.env') });

const BASE_COORDINATES = {
  latitude: 37.4219983,
  longitude: -122.084,
};

const createCoordinates = (latitudeOffset, longitudeOffset) => ({
  latitude: Number((BASE_COORDINATES.latitude + latitudeOffset).toFixed(6)),
  longitude: Number((BASE_COORDINATES.longitude + longitudeOffset).toFixed(6)),
});

const stations = [
  {
    stationName: 'Downtown Charging Hub',
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
    ...createCoordinates(0.0042, -0.0038),
    chargerType: 'DC Fast',
    chargingSpeed: '180 kW DC Fast',
    totalConnectors: 12,
    availableSlots: 6,
    rating: 4.8,
    pricePerUnit: 0.42,
    status: 'active',
  },
  {
    stationName: 'Tesla Supercharger',
    address: '2000 Charleston Rd, Mountain View, CA',
    ...createCoordinates(0.0061, 0.0025),
    chargerType: 'Ultra Fast',
    chargingSpeed: '250 kW Ultra Fast',
    totalConnectors: 16,
    availableSlots: 8,
    rating: 4.9,
    pricePerUnit: 0.48,
    status: 'active',
  },
  {
    stationName: 'Airport EV Station',
    address: 'San Jose Mineta Airport Service Lane, San Jose, CA',
    ...createCoordinates(0.1184, 0.0912),
    chargerType: 'DC Fast',
    chargingSpeed: '150 kW DC Fast',
    totalConnectors: 10,
    availableSlots: 4,
    rating: 4.6,
    pricePerUnit: 0.39,
    status: 'active',
  },
  {
    stationName: 'Green Energy Station',
    address: '123 Shoreline Blvd, Mountain View, CA',
    ...createCoordinates(-0.0074, 0.0143),
    chargerType: 'AC/DC',
    chargingSpeed: '120 kW Hybrid',
    totalConnectors: 14,
    availableSlots: 7,
    rating: 4.7,
    pricePerUnit: 0.36,
    status: 'active',
  },
  {
    stationName: 'Mall Charging Point',
    address: '300 Showers Dr, Mountain View, CA',
    ...createCoordinates(-0.0109, -0.0152),
    chargerType: 'AC',
    chargingSpeed: '22 kW AC',
    totalConnectors: 8,
    availableSlots: 3,
    rating: 4.5,
    pricePerUnit: 0.28,
    status: 'active',
  },
  {
    stationName: 'Fast EV Hub',
    address: '500 Castro St, Mountain View, CA',
    ...createCoordinates(0.0097, -0.0181),
    chargerType: 'DC Fast',
    chargingSpeed: '200 kW DC Fast',
    totalConnectors: 18,
    availableSlots: 9,
    rating: 4.9,
    pricePerUnit: 0.44,
    status: 'active',
  },
  {
    stationName: 'Smart Charge Point',
    address: '450 San Antonio Rd, Palo Alto, CA',
    ...createCoordinates(0.0214, -0.0467),
    chargerType: 'AC/DC',
    chargingSpeed: '90 kW Smart Charge',
    totalConnectors: 10,
    availableSlots: 5,
    rating: 4.4,
    pricePerUnit: 0.31,
    status: 'active',
  },
  {
    stationName: 'Highway EV Stop',
    address: '101 Northbound Rest Area, Mountain View, CA',
    ...createCoordinates(0.0385, 0.0284),
    chargerType: 'DC Fast',
    chargingSpeed: '175 kW DC Fast',
    totalConnectors: 12,
    availableSlots: 6,
    rating: 4.3,
    pricePerUnit: 0.4,
    status: 'active',
  },
  {
    stationName: 'Eco Charge Station',
    address: '700 Evelyn Ave, Mountain View, CA',
    ...createCoordinates(-0.0156, 0.0079),
    chargerType: 'AC',
    chargingSpeed: '11 kW AC',
    totalConnectors: 6,
    availableSlots: 4,
    rating: 4.2,
    pricePerUnit: 0.24,
    status: 'maintenance',
  },
  {
    stationName: 'City EV Network',
    address: '1000 El Camino Real, Sunnyvale, CA',
    ...createCoordinates(0.0541, -0.0256),
    chargerType: 'Ultra Fast',
    chargingSpeed: '300 kW Ultra Fast',
    totalConnectors: 20,
    availableSlots: 11,
    rating: 4.9,
    pricePerUnit: 0.5,
    status: 'active',
  },
  {
    stationName: 'Innovation Parkway Charge',
    address: '2500 Garcia Ave, Mountain View, CA',
    ...createCoordinates(0.0128, 0.0194),
    chargerType: 'AC/DC',
    chargingSpeed: '100 kW Smart Charge',
    totalConnectors: 9,
    availableSlots: 5,
    rating: 4.6,
    pricePerUnit: 0.33,
    status: 'active',
  },
  {
    stationName: 'Campus Green Chargers',
    address: '4400 West Middlefield Rd, Mountain View, CA',
    ...createCoordinates(-0.0221, -0.0413),
    chargerType: 'AC',
    chargingSpeed: '22 kW AC',
    totalConnectors: 8,
    availableSlots: 2,
    rating: 4.1,
    pricePerUnit: 0.27,
    status: 'active',
  },
];

const seedChargingStations = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('[Seed] Connected to MongoDB');
    console.log('[Seed] Clearing existing charging stations');

    await ChargingStation.deleteMany({});

    const payload = stations.map((station) => ({
      ...station,
      location: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude],
      },
    }));

    const inserted = await ChargingStation.insertMany(payload, { ordered: true });

    console.log('[Seed] Inserted charging stations', {
      count: inserted.length,
      stations: inserted.map((station) => ({
        id: station._id,
        name: station.stationName,
        latitude: station.latitude,
        longitude: station.longitude,
        availableSlots: station.availableSlots,
        chargingSpeed: station.chargingSpeed,
      })),
    });
  } catch (error) {
    console.error('[Seed] Failed to seed charging stations', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] MongoDB disconnected');
  }
};

void seedChargingStations();
