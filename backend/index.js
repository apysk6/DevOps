const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

console.log(keys);

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => {
    console.log('No connection to PG DB.');
});

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => {
    console.log(err);
});

app.get('/', (req, resp) => {
    resp.send('Hello backend');
});

app.get('/gcd/:num1/:num2', (req, resp) => {
    const firstNumber = req.params.num1;
    const secondNumber = req.params.num2;
    const parsedCacheValue = firstNumber + ',' + secondNumber;

    redisClient.get(parsedCacheValue, (err, cachedValue) => {
        if (!cachedValue) {
            const countGCDValue = GCD(firstNumber, secondNumber);
            redisClient.set(parsedCacheValue, parseInt(countGCDValue));
            resp.send('NWD liczb ' + firstNumber + " oraz " + secondNumber + ' wynosi: ' + countGCDValue);

            pgClient.query('INSERT INTO results(number) VALUES($1)', [countGCDValue], (err, res) => {
                if (err) {
                    console.log(err.stack);
                };
            })
        }
        else {
            resp.send('NWD liczb ' + firstNumber + " oraz " + secondNumber + ' wynosi: ' + cachedValue);
        };
    });
});

app.get('/gcd/', (req, resp) => {
    pgClient.query('SELECT * FROM results', (err, res) => {
        if (err) {
            console.log(err.stack);
        }
        else {
            resp.send(res.rows);
        };
    })
});

app.listen(8080, () => {
    console.log('Server listening on port: 8080');
});

const GCD = (a, b) => {
    if (!b) {
        return a;
    }

    return GCD(b, a % b);
}