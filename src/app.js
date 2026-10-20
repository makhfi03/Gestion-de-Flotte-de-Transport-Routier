require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const apiGovernance = require('./middlewares/apiGovernance.middleware');
const { standardLimiter } = require('./middlewares/rateLimiter.middleware');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const errorHandler = require('./middlewares/error.middleware');

const swaggerDocument = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiGovernance);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', standardLimiter);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

app.use(errorHandler);

module.exports = app;