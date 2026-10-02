const mongoose = require('mongoose');
const os = require('os');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            runtimeAdapters: { os }
        });
        console.log(`MongoDB Connecté : ${conn.connection.host}`);    
    } catch (error) {
        console.error(`Erreur de connexion à MongoDB : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;