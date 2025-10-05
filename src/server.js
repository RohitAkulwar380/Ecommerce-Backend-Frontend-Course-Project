require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5002;

async function start() {
  let server;
  
  try {
    await connectDB();
    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
      }
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\nShutting down gracefully...');
      
      // Close the HTTP server
      if (server) {
        await new Promise((resolve) => {
          server.close((err) => {
            if (err) {
              console.error('Error closing server:', err);
              resolve();
            } else {
              console.log('Server closed successfully');
              resolve();
            }
          });
        });
      }

      // Close the database connection
      try {
        await mongoose.connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }

      // Exit the process
      process.exit(0);
    };

    // Handle process termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown();
    });
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown();
    });

  } catch (err) {
    console.error("Failed to start the server:", err.message);
    process.exit(1);
  }
}

// Import mongoose at the top
const mongoose = require('mongoose');

start();
