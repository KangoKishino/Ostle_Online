'use strict';

const db = require('../models');

exports.sendGameInfo = (req, res) => {
  res.send({
    user: req.jwt,
    messages: req.messages,
    board: req.board,
  });
};

exports.changeTurn = (req, res) => {
  db.Rooms.findOne({
    where: { id: req.jwt.id },
  })
    .then(room => {
      room.play_first = req.body.playFirst;
      room.save();
      res.send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.changeTime = (req, res) => {
  db.Rooms.findOne({
    where: { id: req.jwt.id },
  })
    .then(room => {
      const time = ['00:03:00', '00:05:00', '00:07:00', null];
      room.time = req.body.time;
      room.host_time = time[room.time];
      room.guest_time = time[room.time];
      room.save();
      res.send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.getBoard = (req, res, next) => {
  db.Boards.findOne({
    where: { id: req.jwt.id },
    attributes: {
      exclude: ['id', 'createdAt', 'updatedAt'],
    },
  }).then(board => {
    req.board = board;
    next();
  });
};

exports.deleteBoard = (req, res, next) => {
  db.Boards.destroy({
    where: {
      id: req.body.myInfo.id,
    },
  })
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};
