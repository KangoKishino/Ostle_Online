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
app.post(
  '/createRoom',
  validateController.validateRoom,
  roomController.createRoom,
  roomController.createBoard,
  messageController.createMessage,
  roomController.createJWT,
  roomController.getRoomInfo
);
app.post(
  '/enterRoom',
  roomController.checkPassword,
  roomController.createJWT,
  roomController.enteredStatus,
  messageController.enterMessage,
  roomController.getRoomInfo
);
app.post(
  '/getGameInfo',
  roomController.auth,
  gameController.getBoard,
  messageController.getMessages,
  gameController.sendGameInfo
);

app.post(
  '/sendMessage',
  roomController.auth,
  validateController.validateMessage,
  messageController.setMessage,
  messageController.sendMessages
);
app.post('/getMessages', roomController.auth, messageController.sendMessages);
app.post('/changeTurn', roomController.auth, gameController.changeTurn);
app.post('/changeTime', roomController.auth, gameController.changeTime);

app.post('/leaveRoom', messageController.leaveRoom, roomController.beforeStatus);
app.post(
  '/deleteRoom',
  roomController.deleteRoom,
  gameController.deleteBoard,
  messageController.deleteMessage
);

module.exports = app;
