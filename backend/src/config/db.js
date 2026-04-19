const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI||"mongodb+srv://ranasundaraisuru4_db_user:k0bE4rJTYzbAKMXe@cluster0.y8kpfa4.mongodb.net/?appName=Cluster0";

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
