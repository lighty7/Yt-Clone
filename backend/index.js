const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { testConnection } = require("./config/database");
const createTables = require("./config/createTables");
const errorHandler = require("./middleware/errorHandler");
const { testEmailConnection } = require("./services/emailService");
const { corsMiddleware } = require("./config/cors");
const { config, validateConfig } = require("./config/environment");

const app = express();
const port = config.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(helmet());
app.use(limiter);
// Use CORS middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "YT Clone API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});
app.use("/api/auth", require("./routes/auth"));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const startServer = async () => {
  try {
    // Validate configuration
    validateConfig();
    
    // Test email connection in production
    if (config.NODE_ENV === 'production') {
      const emailConnected = await testEmailConnection();
      if (!emailConnected) {
        console.warn('⚠️ Email service connection failed, but continuing...');
      }
    }
    
    await testConnection();
    await createTables();
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
      console.log(`📧 Email Service: ${config.SMTP_USER ? 'Configured' : 'Not configured'}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
