'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const expireTime = process.env.EXPIRE_TIME;
const secretKey = process.env.SECRET_KEY;
const { validationResult } = require('express-validator');

exports.sendRooms = async (req, res) => {
  const rooms = await db.Rooms.findAll({
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt'],
    },
  });
  res
    .send({
      rooms: rooms,
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.getRooms = (req, res, next) => {
  db.Rooms.findAll({
    where: { id: req.body.id },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt'],
    },
  })
    .then(rooms => {
      req.rooms = rooms;
      next();
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

(exports.getRoomInfo = (req, res) => {
  db.Messages.findAll({
    where: { room_id: req.message.room_id },
  })
    .then(messages => {
      res.send({
        id: req.message.room_id,
        messages: messages,
        token: req.token,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
}),
  (exports.createRoom = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        error: errors.array()[0].msg,
      });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const newRoom = db.Rooms.build({
      name: req.body.name,
      password: hashedPassword,
      full_capacity: 0,
      status: 'before',
      play_first: 'host',
      time: 1,
      host_time: '00:05:00',
      guest_time: '00:05:00',
    });
    newRoom
      .save()
      .then(room => {
        req.room = room;
        next();
      })
      .catch(() => {
        res.send({
          error: 'この部屋名は既に利用されています',
        });
      });
  });

exports.createBoard = (req, res, next) => {
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
  });
  newBoard
    .save()
    .then(board => {
      req.board = board;
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Board Error!' });
    });
};

exports.createJWT = (req, res, next) => {
  const payload = {
    id: req.room.id,
    user: req.body.user,
  };
  const option = {
    expiresIn: expireTime,
  };
  const token = jwt.sign(payload, secretKey, option);
  req.token = token;
  next();
};

exports.checkPassword = (req, res, next) => {
  db.Rooms.findOne({
    where: { id: req.body.room.id },
  }).then(room => {
    if (bcrypt.compareSync(req.body.password, room.dataValues.password)) {
      req.room = room;
      next();
    } else {
      res.status(400).json({ error: 'Password do not match!' });
    }
  });
};

exports.auth = (req, res, next) => {
  const token = req.body.token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(400).json({ error: 'Access is Denied!' });
    } else {
      req.jwt = decoded;
      next();
    }
  });
};

exports.enteredStatus = (req, res, next) => {
  db.Rooms.findOne({
    where: { id: req.room.id },
  })
    .then(room => {
      room.status = 'entered';
      room.save();
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.beforeStatus = (req, res) => {
  db.Rooms.findOne({
    where: { id: req.body.myInfo.id },
  })
    .then(room => {
      room.status = 'before';
      room.save();
      res.send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.deleteRoom = (req, res, next) => {
  db.Rooms.findOne({
    where: { id: req.body.myInfo.id },
  })
    .then(room => {
      room.destroy();
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};
