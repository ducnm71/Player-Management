const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const dbConfig = "mongodb+srv://courseHust:courseHust@cluster0.d0q1qov.mongodb.net/smartParking";
    const connect = await mongoose.connect(dbConfig);
    console.log(`Mongodb connected: ${connect.connection.host}`);
  } catch (e) {
    console.log('Error connect to mongodb:', e);
  }
};

module.exports = connectDB;
