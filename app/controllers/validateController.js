'use strict';

const { check } = require('express-validator');

exports.validateRoom = [
  check('name')
    .isLength({ max: 128 })
    .withMessage('部屋名の最大桁数は128文字です'),

  check('password')
    .isLength({ min: 7 })
    .withMessage('パスワードの最小桁数は7文字です')
    .isLength({ max: 128 })
    .withMessage('パスワードの最大桁数は128文字です'),
];
