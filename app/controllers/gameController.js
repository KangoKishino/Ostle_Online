'use strict';

const db = require('../models');
const roomController = require('./roomController');
const dropedHostPiece = 25;
const dropedGuestPiece = 26;

exports.getCoordinates = (id, res) => {
  return db.Boards.findOne({
    where: { id: id },
    attributes: {
      exclude: [
        'id',
        'new_coordinates',
        'old_coordinates',
        'my_turn',
        'host_time',
        'guest_time',
        'createdAt',
        'updatedAt',
      ],
    },
  })
    .then(coordinates => {
      return coordinates;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error!' });
    });
};

exports.getGameInfo = (id, res) => {
  return db.Boards.findOne({
    where: { id: id },
    attributes: {
      exclude: [
        'id',
        'host_coordinates1',
        'host_coordinates2',
        'host_coordinates3',
        'host_coordinates4',
        'host_coordinates5',
        'guest_coordinates1',
        'guest_coordinates2',
        'guest_coordinates3',
        'guest_coordinates4',
        'guest_coordinates5',
        'hole_coordinates',
        'createdAt',
        'updatedAt',
      ],
    },
  })
    .then(gameInfo => {
      return gameInfo;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error!' });
    });
};

exports.changeTurn = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  await roomController.changeTurn(jwt.id, req.body.playFirst, res);
  await changeTurn(jwt.id, req.body.playFirst, res);
  res.status(200).send();
};

exports.changeTime = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  await roomController.changeTime(jwt.id, req.body.time, res);
  await changeTime(jwt.id, req.body.time, res);
  res.status(200).send();
};

exports.getBoard = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  const coordinates = await getCoordinates(jwt.id, res);
  const gameInfo = await getGameInfo(jwt.id, res);
  res.send({
    coordinates: coordinates,
    gameInfo: gameInfo,
  });
};

exports.startGame = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  db.Rooms.findOne({
    where: { id: jwt.id },
  })
    .then(room => {
      room.status = 'running';
      room.save();
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
};

exports.movePiece = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  const coordinates = await getCoordinates(jwt.id, res);
  await movePiece(jwt, coordinates, req, res);
  res.status(200).send();
};

exports.moveHole = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  const coordinates = await getCoordinates(jwt.id, res);
  await moveHole(jwt, coordinates, req, res);
  res.status(200).send();
};

exports.resetGame = async (req, res) => {
  const jwt = await roomController.auth(req.body.token, res);
  db.Boards.update(
    {
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
      hole_coordinates: 12,
      new_coordinates: null,
      old_coordinates: null,
      my_turn: req.body.playFirst,
    },
    { where: { id: jwt.id } }
  )
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
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

function getCoordinates(id, res) {
  return db.Boards.findOne({
    where: { id: id },
    attributes: {
      exclude: [
        'id',
        'new_coordinates',
        'old_coordinates',
        'my_turn',
        'host_time',
        'guest_time',
        'createdAt',
        'updatedAt',
      ],
    },
  })
    .then(board => {
      return board;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error!' });
    });
}

function getGameInfo(id, res) {
  return db.Boards.findOne({
    where: { id: id },
    attributes: {
      exclude: [
        'id',
        'host_coordinates1',
        'host_coordinates2',
        'host_coordinates3',
        'host_coordinates4',
        'host_coordinates5',
        'guest_coordinates1',
        'guest_coordinates2',
        'guest_coordinates3',
        'guest_coordinates4',
        'guest_coordinates5',
        'hole_coordinates',
        'createdAt',
        'updatedAt',
      ],
    },
  })
    .then(board => {
      return board;
    })
    .catch(() => {
      res.status(500).json({ error: 'Response Error!' });
    });
}

function changeTurn(id, user, res) {
  return db.Boards.findOne({
    where: { id: id },
  })
    .then(board => {
      board.my_turn = user;
      board.save();
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
}

function changeTime(id, reqTime, res) {
  return db.Boards.findOne({
    where: { id: id },
  })
    .then(board => {
      const time = ['00:03:00', '00:05:00', '00:07:00', null];
      board.host_time = time[reqTime];
      board.guest_time = time[reqTime];
      board.save();
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'Capacity change Error!' });
    });
}

function movePiece(jwt, board, req, res) {
  let nextTurn = '';
  jwt.user === 'host' ? (nextTurn = 'guest') : (nextTurn = 'host');
  const oldCoordinates = req.body.oldCoordinates[0] * 5 + req.body.oldCoordinates[1]; //動く前のコマの座標取得
  const newCoordinates = req.body.newCoordinates[0] * 5 + req.body.newCoordinates[1]; //動いた後のコマの座標取得
  const dif0 = req.body.newCoordinates[0] - req.body.oldCoordinates[0];
  const dif1 = req.body.newCoordinates[1] - req.body.oldCoordinates[1];
  const dif = newCoordinates - oldCoordinates;
  const checkArray = [];
  let dropPiece = false;
  const array = Object.keys(board.dataValues).map(key => {
    //配列に変換
    return board.dataValues[key];
  });
  let nextCoordinates = req.body.newCoordinates;

  for (const value of [1, 2, 3, 4]) {
    //押せる部分検索
    for (const coordinate in board.dataValues) {
      if (
        board.dataValues[coordinate] === nextCoordinates[0] * 5 + nextCoordinates[1] &&
        coordinate === 'hole_coordinates'
      ) {
        dropPiece = true;
        break;
      } else if (board.dataValues[coordinate] === nextCoordinates[0] * 5 + nextCoordinates[1]) {
        checkArray.unshift(nextCoordinates[0] * 5 + nextCoordinates[1]); //押す部分
      }
    }
    nextCoordinates[0] += dif0;
    nextCoordinates[1] += dif1;
    if (checkArray.length !== value) {
      break;
    } else if (
      nextCoordinates[0] < 0 ||
      nextCoordinates[0] >= 5 ||
      nextCoordinates[1] < 0 ||
      nextCoordinates[1] >= 5 ||
      dropPiece === true
    ) {
      dropPiece = true;
      break;
    }
  }

  if (checkArray) {
    checkArray.forEach((checkArrayKey, checkArrayIndex) => {
      array.forEach((arrayKey, arrayIndex) => {
        if (dropPiece && checkArrayIndex === 0 && arrayKey === checkArray[0]) {
          if (0 <= arrayIndex && arrayIndex < 5) {
            array.splice(arrayIndex, 1, dropedHostPiece);
          } else {
            array.splice(arrayIndex, 1, dropedGuestPiece);
          }
        } else if (arrayKey === checkArrayKey) {
          array.splice(arrayIndex, 1, arrayKey + dif);
        }
      });
    });
  }

  array.forEach((key, index) => {
    if (key === oldCoordinates) {
      array.splice(index, 1, newCoordinates);
    }
  });

  db.Boards.update(
    {
      host_coordinates1: array[0],
      host_coordinates2: array[1],
      host_coordinates3: array[2],
      host_coordinates4: array[3],
      host_coordinates5: array[4],
      guest_coordinates1: array[5],
      guest_coordinates2: array[6],
      guest_coordinates3: array[7],
      guest_coordinates4: array[8],
      guest_coordinates5: array[9],
      new_coordinates: oldCoordinates,
      old_coordinates: newCoordinates,
      my_turn: nextTurn,
    },
    { where: { id: jwt.id } }
  )
    .then(() => {
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
}

function moveHole(jwt, board, req, res) {
  const oldCoordinates = req.body.oldCoordinates[0] * 5 + req.body.oldCoordinates[1]; //動く前のコマの座標取得
  const newCoordinates = req.body.newCoordinates[0] * 5 + req.body.newCoordinates[1];
  let nextTurn = '';
  jwt.user === 'host' ? (nextTurn = 'guest') : (nextTurn = 'host');
  const array = Object.keys(board.dataValues).map(key => {
    return board.dataValues[key];
  });
  array.forEach((key, index) => {
    if (key === oldCoordinates) {
      array.splice(index, 1, newCoordinates);
    }
  });

  db.Boards.update(
    {
      hole_coordinates: array[10],
      new_coordinates: oldCoordinates,
      old_coordinates: newCoordinates,
      my_turn: nextTurn,
    },
    { where: { id: jwt.id } }
  )
    .then(() => {
      return;
    })
    .catch(() => {
      res.status(400).json({ error: 'DB Change Error!' });
    });
}
