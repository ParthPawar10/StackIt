import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not configured. Server will run without database connection.');
      return;
    }

    // Check if it's a placeholder URI
    if (process.env.MONGODB_URI.includes('<username>') || process.env.MONGODB_URI.includes('<password>')) {
      console.log('MongoDB URI contains placeholders. Please update with your actual credentials.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout for cloud
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('Authentication failed. Check your username and password in the connection string.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log('DNS/Network error. This usually means:');
      console.log('Special characters in password need URL encoding (@→%40, #→%23, etc.)');
      console.log('Check cluster name is correct');
      console.log('Verify internet connection');
    } else if (error.message.includes('network')) {
      console.log('Network error. Check your internet connection and MongoDB Atlas configuration.');
    } else if (error.message.includes('timeout')) {
      console.log('Connection timeout. MongoDB Atlas might be starting up or network is slow.');
    }
  }
};

export default connectDB;
