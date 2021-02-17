'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');

exports.fetchRoom = async (req, res) => {
	const rooms = await db.Rooms.findAll({
		attributes: {
			exclude: ['password', 'createdAt', 'updatedAt']
		}
	});
	res.send({
		rooms: rooms
	})
		.catch(() => {
			res.status(500).json({ error: 'Response Error' });
		})
};

exports.makeRoom = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.send({
			error: errors.array()[0].msg
		});
	}
	const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
	const newRoom = db.Rooms.build({
		name: req.body.name,
		password: hashedPassword
	});
	newRoom
		.save()
		.then(() => {
			next();
		})
		.catch(() => {
			res.send({
				error: 'この部屋名は既に利用されています'
			});
		})
};
