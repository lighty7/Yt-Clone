const { supabase } = require('./database');
require('dotenv').config();

const createTables = async () => {
  // Skip table creation check - Supabase handles this through dashboard
  console.log('✅ Skipping automatic table creation');
};

module.exports = createTables;
