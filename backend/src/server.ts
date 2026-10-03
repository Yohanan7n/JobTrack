import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './services/prisma.service';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to the database with Prisma.');

    app.listen(PORT, () => {
      console.log(`JobTrack API Server running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
