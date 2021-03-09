'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const roomController = require('./controllers/roomController');
const validateController = require('./controllers/validateController');
const messageController = require('./controllers/messageController');
const gameController = require('./controllers/gameController');
const methodOverride = require('method-override');

const app = express();

app.use('/public', express.static(__dirname + '/public'));
app.set('/public', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post('/getRooms', roomController.sendRooms);
app.post('/createRoom', validateController.validateRoom, roomController.createRoom);
app.post('/enterRoom', roomController.enterRoom);
app.post('/getGameInfo', roomController.getGameInfo);
app.post('/afterStatus', roomController.afterStatus);

app.post('/sendMessage', validateController.validateMessage, messageController.sendMessage);
app.post('/receiveMessages', messageController.receiveMessages);

app.post('/changeTurn', gameController.changeTurn);
app.post('/changeTime', gameController.changeTime);
app.post('/getBoard', gameController.getBoard);
app.post('/startGame', gameController.startGame);
app.post('/movePiece', gameController.movePiece);
app.post('/moveHole', gameController.moveHole);
app.post('/timeOut', gameController.timeOut);
app.post('/resetGame', gameController.resetGame);

app.post('/leaveRoom', roomController.leaveRoom);
app.post('/deleteRoom', roomController.deleteRoom);

module.exports = app;
