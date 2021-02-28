'use strict';

const db = require('../models');
const roomController = require('./roomController');

exports.getBoard = (id, res) => {
  return db.Boards.findOne({
    where: { id: id },
    attributes: {
      exclude: ['id', 'new_coordinates', 'old_coordinates', 'createdAt', 'updatedAt'],
    },
  })
    .then(board => {
      return board;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error!' });
    });
};

exports.changeTurn = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  db.Rooms.findOne({
    where: { id: jwt.id },
  })
    .then(room => {
      room.play_first = req.body.playFirst;
      room.save();
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.changeTime = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  db.Rooms.findOne({
    where: { id: jwt.id },
  })
    .then(room => {
      const time = ['00:03:00', '00:05:00', '00:07:00', null];
      room.time = req.body.time;
      room.host_time = time[room.time];
      room.guest_time = time[room.time];
      room.save();
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.deleteBoard = (id, res) => {
  return db.Boards.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};
