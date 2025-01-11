const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const buildRoutes = require('./middleware/buildRoutes');
const currentRoutes = fs.readdirSync(__dirname + '/routes/');
const buildedRoutes = buildRoutes(app, currentRoutes);

const buildSwagger = require('./middleware/buildSwagger');
buildSwagger(app, port, buildedRoutes).then(() => {
  app.listen(port, () => {
    console.log(`URL: http://localhost:${port}`);
  });
});