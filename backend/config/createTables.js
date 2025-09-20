const { sequelize } = require('./database');
const User = require('../models/User');
const Users = require('../models/Users.model');
const LoginLog = require('../models/loginLogs');
const Videos = require('../models/videos');

const createTables = async () => {
  try {
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

module.exports = createTables;
