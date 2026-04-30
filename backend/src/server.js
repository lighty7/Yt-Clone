const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/database');
const createTables = require('./config/createTables');
const { initErrorHandling } = require('./middleware/error');

const port = env.port;

const startServer = async () => {
  try {
    // Initialize error handling
    initErrorHandling();

    // Validate required environment variables
    const requiredEnvVars = ['jwtSecret'];
    const missingVars = requiredEnvVars.filter(varName => !env[varName]);

    if (missingVars.length > 0 && env.nodeEnv !== 'development') {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
      console.log('💡 Please check your environment configuration');
      process.exit(1);
    }

    await testConnection();
    await createTables();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server running on port ${port}`);
      // eslint-disable-next-line no-console
      console.log(`🌍 Environment: ${env.nodeEnv}`);
      // eslint-disable-next-line no-console
      console.log(`🔗 Frontend URL: ${env.frontendUrl}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


