'use strict';

const db = require('../models');
const { validationResult } = require('express-validator');
const roomController = require('./roomController');

exports.getMessages = (id, res) => {
  return db.Messages.findAll({
    where: { room_id: id },
  })
    .then(messages => {
      return messages;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.createMessage = (id, res) => {
  const newMessage = db.Messages.build({
    room_id: id,
    user: 'サーバー',
    message: 'ホストが入室しました',
  });
  return newMessage
    .save()
    .then(message => {
      return message;
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
};

exports.enterMessage = (id, res) => {
  const newMessage = db.Messages.build({
    room_id: id,
    user: 'サーバー',
    message: 'ゲストが入室しました',
  });
  return newMessage
    .save()
    .then(() => {
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
};

exports.sendMessage = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      error: errors.array()[0].msg,
    });
  }
  const jwt = await roomController.auth(req.body.token, res);
  await setMessage(jwt.id, req.body.user, req.body.message, res);
  db.Messages.findAll({
    where: { room_id: jwt.id },
  })
    .then(messages => {
      res.send({
        user: jwt,
        messages: messages,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

exports.receiveMessages = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  db.Messages.findAll({
    where: { room_id: jwt.id },
  })
    .then(messages => {
      res.send({
        user: jwt,
        messages: messages,
      });
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error' });
    });
};

function setMessage(id, user, message, res) {
  const newMessage = db.Messages.build({
    room_id: id,
    user: user,
    message: message,
  });
  return newMessage
    .save()
    .then(message => {
      return message;
    })
    .catch(() => {
      res.status(400).json({ error: 'Create Message Error!' });
    });
}

exports.leaveRoom = (id, res) => {
  const newMessage = db.Messages.build({
    room_id: id,
    user: 'サーバー',
    message: 'ゲストが退室しました',
  });
  return newMessage
    .save()
    .then(() => {
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};

exports.deleteMessage = (id, res) => {
  return db.Messages.destroy({
    where: {
      room_id: id,
    },
  })
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
};
