const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const knex = require('knex');

const upload = require('./handlers/upload');

const API = express();

API.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Access-Token, XKey, Authorization');
    next();
});

API.use(bodyParser.json());

const database = knex({
    client: 'sqlite3',
    connection: {
        filename: './database/memes.sqlite'
    },
    useNullAsDefault: true
});

database.schema.hasTable('memes')
    .then((exist) => {
        if (!exist) {
            database.schema.createTable('memes', (table) => {
                table.increments('id');
                table.text('name');
                table.text('caption');
                table.text('url');
            })
                .then(() => {
                    console.log('Database created.');
                })
        } else {
            console.log('Database already exists.')
        }
    })
    .catch(err => console.log(err))

const PORT = process.env.PORT || 8081;

API.post('/memes', (req, res) => {
    upload.handleUpload(req, res, database);
});

API.get('/memes', (req, res) => {
    upload.handleGetMemes(req, res, database);
});

API.get('/memes/:id', (req, res) => {
    upload.handleGetByID(req, res, database);
})

API.listen(PORT, () => console.log(`Server is running at ${PORT}`));
