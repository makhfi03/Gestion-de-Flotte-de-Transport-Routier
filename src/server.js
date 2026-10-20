require('dotenv').config();

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const app = require('./app');

connectDB();
connectRedis();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});