const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
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

app.post('/median', (req, res) => {
    const numbers = req.body.numbers;
    const parsedCacheValue = numbers.join(',');

    redisClient.get(parsedCacheValue, (err, cachedValue) => {
        if (!cachedValue) {
            const calculatedMedianValue = calculateMedian(numbers);
            redisClient.set(parsedCacheValue, calculatedMedianValue);
            res.json({ median: calculatedMedianValue });

            pgClient.query('INSERT INTO results(number) VALUES($1)', [calculatedMedianValue], (err, res) => {
                if (err) {
                    console.log(err.stack);
                };
            })
        }
        else {
            res.json({ median: cachedValue });
        };
    });
});

app.listen(4000, () => {
    console.log('Server listening on port: 4000');
});

const calculateMedian = (values) => {
    if (values.length === 0) return 0;

    values.sort((a, b) => {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}