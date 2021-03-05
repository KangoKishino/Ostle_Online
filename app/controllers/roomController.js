'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const expireTime = process.env.EXPIRE_TIME;
const secretKey = process.env.SECRET_KEY;
const { validationResult } = require('express-validator');
const messageController = require('./messageController');
const gameController = require('./gameController');

exports.sendRooms = async (req, res) => {
  const rooms = await db.Rooms.findAll({
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt'],
    },
  });
  res.send({
    rooms: rooms,
  });
};

exports.createRoom = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      error: errors.array()[0].msg,
    });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  const room = await createNewRoom(req.body.name, hashedPassword, res);
  await createBoard(res);
  const token = await createJWT(room.id, req.body.user);
  const message = await messageController.createMessage(room.id, res);
  db.Messages.findAll({
    where: { room_id: room.id },
  })
    .then(messages => {
      res.send({
        id: message.room_id,
        messages: messages,
        token: token,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.enterRoom = async (req, res) => {
  checkPassword(req.body.room.id, req.body.password, res);
  const token = await createJWT(req.body.room.id, req.body.user);
  await enteredStatus(req.body.room.id, res);
  await messageController.enterMessage(req.body.room.id, res);
  db.Messages.findAll({
    where: { room_id: req.body.room.id },
  })
    .then(messages => {
      res.send({
        id: req.body.room.id,
        messages: messages,
        token: token,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.getGameInfo = async (req, res) => {
  const jwt = await auth(req.body.token, res);
  const coordinates = await gameController.getCoordinates(jwt.id, res);
  const gameInfo = await gameController.getGameInfo(jwt.id, res);
  const messages = await messageController.getMessages(jwt.id, res);
  res.send({
    user: jwt,
    messages: messages,
    coordinates: coordinates,
    gameInfo: gameInfo,
  });
};

exports.afterStatus = async (req, res) => {
  const jwt = await auth(req.body.token, res);
  db.Rooms.findOne({
    where: { id: jwt.id },
  })
    .then(room => {
      room.status = 'after';
      room.save();
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.leaveRoom = async (req, res) => {
  await messageController.leaveRoom(req.body.myInfo.id, res);
  db.Rooms.findOne({
    where: { id: req.body.myInfo.id },
  })
    .then(room => {
      room.status = 'before';
      room.save();
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.deleteRoom = async (req, res) => {
  await deleteRoom(req.body.myInfo.id, res);
  await gameController.deleteBoard(req.body.myInfo.id, res);
  await messageController.deleteMessage(req.body.myInfo.id, res);
};

exports.auth = (token, res) => {
  return jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(400).json({ error: 'Access is Denied!' });
      return;
    }
    return decoded;
  });
};

function createNewRoom(name, hashedPassword, res) {
  const newRoom = db.Rooms.build({
    name: name,
    password: hashedPassword,
    full_capacity: 0,
    status: 'before',
    play_first: 'host',
    time: 1,
  });
  return newRoom
    .save()
    .then(room => {
      return room;
    })
    .catch(() => {
      res.send({
        error: 'この部屋名は既に利用されています',
      });
    });
}

function createJWT(id, user) {
  const payload = {
    id: id,
    user: user,
  };
  const option = {
    expiresIn: expireTime,
  };
  const token = jwt.sign(payload, secretKey, option);
  return token;
}

function createBoard(res) {
  const newBoard = db.Boards.build({
    hole_coordinates: 12,
    host_coordinates1: 20,
    host_coordinates2: 21,
    host_coordinates3: 22,
    host_coordinates4: 23,
    host_coordinates5: 24,
    guest_coordinates1: 0,
    guest_coordinates2: 1,
    guest_coordinates3: 2,
    guest_coordinates4: 3,
    guest_coordinates5: 4,
    new_coordinates: null,
    old_coordinates: null,
    my_turn: 'host',
    host_time: '00:05:00',
    guest_time: '00:05:00',
  });
  return newBoard
    .save()
    .then(board => {
      return board;
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Board Error!' });
    });
}

function checkPassword(id, password, res) {
  db.Rooms.findOne({
    where: { id: id },
  }).then(room => {
    if (!bcrypt.compareSync(password, room.password)) {
      res.status(400).json({ error: 'Password do not match!' });
      return;
    }
    return room;
  });
}

function auth(token, res) {
  return jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(400).json({ error: 'Access is Denied!' });
      return;
    }
    return decoded;
  });
}

function enteredStatus(id, res) {
  db.Rooms.findOne({
    where: { id: id },
  })
    .then(room => {
      room.status = 'entered';
      room.save();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
}

exports.changeTurn = (id, user, res) => {
  return db.Rooms.findOne({
    where: { id: id },
  })
    .then(room => {
      room.play_first = user;
      room.save();
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.changeTime = (id, reqTime, res) => {
  return db.Rooms.findOne({
    where: { id: id },
  })
    .then(room => {
      room.time = reqTime;
      room.save();
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

function deleteRoom(id, res) {
  return db.Rooms.findOne({
    where: { id: id },
  })
    .then(room => {
      room.destroy();
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
}
