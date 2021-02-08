'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');

exports.fetchRoom = async (req, res) => {
    const rooms = await db.Rooms.findAll();
    res.send({
        room: rooms
    });
};

exports.makeRoom = (req, res, next) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
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
