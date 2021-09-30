const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/uploads`));

const httpServer = http.createServer(app);

const port = 6000;
httpServer.listen(port, () => {
  console.log('Service running on port 6000');
});

module.exports = app;
