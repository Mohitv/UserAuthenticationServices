// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//local MongoDB connection
//mongoose.connect('mongodb://localhost:auth/auth');
//db.ensureIndex({ geoLocation: '2dsphere' });
//connection to Document DB in Azure - now instance is removed
//mongoose.connect('mongodb://dbdellemc:o8jIgSQFSNClXGqDI6eYTV1OxN3doMPTLsvmQ80wR2AImshcVoC9B5QdHktbDMbB35DmGOyCeYPHzQoVS1CobQ==@dbdellemc.documents.azure.com:10250/auth/?ssl=true');
//connection to MLabs database collections
mongoose.connect('mongodb://admin:admin@ds056979.mlab.com:56979/dbdellemc');
console.log('connected');
// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 8081;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

module.exports =server;
