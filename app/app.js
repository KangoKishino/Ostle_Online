'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const roomController = require('./controllers/roomController');
const validateController = require('./controllers/validateController');
const methodOverride = require("method-override");

const app = express();

app.use('/public', express.static(__dirname + '/public'));
app.set('/public', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

app.use(
    methodOverride("_method", {
      methods: ["POST", "GET"]
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post('/fetchRoom', roomController.fetchRoom);
app.post('/makeRoom', validateController.validateRoom, roomController.makeRoom, roomController.fetchRoom);

module.exports = app;