import mongoose from 'mongoose';

// Variabel lingkungan MONGO_URL telah diatur di Dockerfile
const mongoURL: string = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURL, {
      maxPoolSize: 100,
      minPoolSize: 0,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 20000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
