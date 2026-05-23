const { DataTypes } = require('sequelize');
const db = require('../../config/database');

function getFleetModel() {
  const sequelize = db.getSequelize();
  if (!sequelize) throw new Error('Sequelize not initialized');

  if (sequelize.models && sequelize.models.Fleet) return sequelize.models.Fleet;

  const Fleet = sequelize.define('Fleet', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    fleetManagerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    registrationNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    gstNumber: { type: DataTypes.STRING },
    totalVehicles: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalDrivers: { type: DataTypes.INTEGER, defaultValue: 0 },
    registrationDoc: { type: DataTypes.STRING },
    gstDoc: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
  });

  return Fleet;
}

class FleetServiceMySQL {
  async registerFleet(fleetManagerId, fleetData) {
    try {
      const Fleet = getFleetModel();
      const exists = await Fleet.findOne({ where: { registrationNumber: fleetData.registrationNumber } });
      if (exists) throw { status: 400, message: 'Fleet already registered with this registration number', code: 'FLEET_EXISTS' };

      const fleet = await Fleet.create({ fleetManagerId, ...fleetData });
      return { success: true, message: 'Fleet registered successfully', data: fleet };
    } catch (error) {
      throw error;
    }
  }

  async getFleetDetails(fleetManagerId) {
    try {
      const Fleet = getFleetModel();
      const fleet = await Fleet.findOne({ where: { fleetManagerId } });
      if (!fleet) throw { status: 404, message: 'Fleet not found', code: 'FLEET_NOT_FOUND' };
      return { success: true, message: 'Fleet details retrieved successfully', data: fleet };
    } catch (error) {
      throw error;
    }
  }

  async getAllFleets(filters = {}) {
    try {
      const Fleet = getFleetModel();
      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.isVerified !== undefined) where.isVerified = filters.isVerified;
      const fleets = await Fleet.findAll({ where });
      return { success: true, message: 'Fleets retrieved successfully', data: fleets };
    } catch (error) {
      throw error;
    }
  }

  async updateFleet(fleetManagerId, updateData) {
    try {
      const Fleet = getFleetModel();
      const [updated] = await Fleet.update(updateData, { where: { fleetManagerId } });
      if (!updated) throw { status: 404, message: 'Fleet not found', code: 'FLEET_NOT_FOUND' };
      const fleet = await Fleet.findOne({ where: { fleetManagerId } });
      return { success: true, message: 'Fleet updated successfully', data: fleet };
    } catch (error) {
      throw error;
    }
  }

  async verifyFleet(fleetId) {
    try {
      const Fleet = getFleetModel();
      const [updated] = await Fleet.update({ isVerified: true, status: 'approved' }, { where: { id: fleetId } });
      if (!updated) throw { status: 404, message: 'Fleet not found', code: 'FLEET_NOT_FOUND' };
      const fleet = await Fleet.findByPk(fleetId);
      return { success: true, message: 'Fleet verified successfully', data: fleet };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FleetServiceMySQL();
