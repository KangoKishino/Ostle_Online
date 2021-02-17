'use strict';

const { check } = require('express-validator');

exports.validateRoom = [
  check('name').isLength({ max: 128 }).withMessage('部屋名の最大桁数は128文字です'),
  check('password').isLength({ max: 128 }).withMessage('パスワードの最大桁数は128文字です'),
];