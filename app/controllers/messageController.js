'use strict';

const db = require('../models');
const { validationResult } = require('express-validator');

exports.sendMessages = (req, res) => {
  db.Messages.findAll({
    where: { room_id: req.jwt.id },
  })
    .then(messages => {
      res.send({
        user: req.jwt,
        messages: messages,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.getMessages = (req, res, next) => {
  db.Messages.findAll({
    where: { room_id: req.jwt.id },
  })
    .then(messages => {
      req.messages = messages;
      next();
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.createMessage = (req, res, next) => {
  const newMessage = db.Messages.build({
    room_id: req.room.id,
    user: 'サーバー',
    message: 'ホストが入室しました',
  });
  newMessage
    .save()
    .then(message => {
      req.message = message;
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
};

exports.enterMessage = (req, res, next) => {
  const newMessage = db.Messages.build({
    room_id: req.body.room.id,
    user: 'サーバー',
    message: 'ゲストが入室しました',
  });
  newMessage
    .save()
    .then(message => {
      req.message = message;
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
};

exports.setMessage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      error: errors.array()[0].msg,
    });
  }
  const newMessage = db.Messages.build({
    room_id: req.jwt.id,
    user: req.body.user,
    message: req.body.message,
  });
  newMessage
    .save()
    .then(message => {
      req.message = message;
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
};

exports.leaveRoom = (req, res, next) => {
  const newMessage = db.Messages.build({
    room_id: req.body.myInfo.id,
    user: 'サーバー',
    message: 'ゲストが退室しました',
  });
  newMessage
    .save()
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};

exports.deleteMessage = (req, res) => {
  db.Messages.destroy({
    where: {
      room_id: req.body.myInfo.id,
    },
  })
    .then(() => {
      res.send();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};
