'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
			res.status(400).json({ error: 'Email already exists!' });
		})
};
