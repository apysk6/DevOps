const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const appId = uuidv4();
const appPort = 5050;

app.get('/', (req,res) => {
    res.send(`[${appId}] Hello from Ingress smoke test.`);
});

app.listen(appPort, () => {
    console.log('Server listening on port: ' + appPort);
    console.log('Server UUID: ' + appId);
});