const ChargingStation = require('./charging.model');

class ChargingService {
  // Add Charging Station
  async addChargingStation(stationData) {
    try {
      const station = await ChargingStation.create(stationData);

      return {
        success: true,
        message: 'Charging station added successfully',
        data: station,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Stations
  async getAllStations(filters = {}) {
    try {
      const query = { isActive: true };
      if (filters.city) query.city = filters.city;
      if (filters.state) query.state = filters.state;

      const stations = await ChargingStation.find(query).sort({ rating: -1 });

      return {
        success: true,
        message: 'Charging stations retrieved successfully',
        data: stations,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Station Details
  async getStationDetails(stationId) {
    try {
      const station = await ChargingStation.findById(stationId);

      if (!station) {
        throw {
          status: 404,
          message: 'Charging station not found',
          code: 'STATION_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Station details retrieved successfully',
        data: station,
      };
    } catch (error) {
      throw error;
    }
  }

  // Book Charging Slot
  async bookChargingSlot(userId, bookingData) {
    try {
      const station = await ChargingStation.findById(bookingData.stationId);

      if (!station) {
        throw {
          status: 404,
          message: 'Charging station not found',
          code: 'STATION_NOT_FOUND',
        };
      }

      if (station.availableConnectors <= 0) {
        throw {
          status: 400,
          message: 'No available connectors at this station',
          code: 'NO_AVAILABLE_CONNECTORS',
        };
      }

      // Update available connectors
      station.availableConnectors -= 1;
      await station.save();

      return {
        success: true,
        message: 'Charging slot booked successfully',
        data: {
          bookingId: Date.now(),
          stationId: station._id,
          stationName: station.stationName,
          location: station.location,
          estimatedTime: bookingData.estimatedTime,
          bookingTime: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Station Status
  async updateStation(stationId, updateData) {
    try {
      const station = await ChargingStation.findByIdAndUpdate(
        stationId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!station) {
        throw {
          status: 404,
          message: 'Charging station not found',
          code: 'STATION_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Station updated successfully',
        data: station,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChargingService();
