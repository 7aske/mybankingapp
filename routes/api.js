const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/user');

router.get('/', (req, res) => {
	res.send('Hello API');
});
router.get('/users', (req, res) => {
	Users.find({})
		.then(result => {
			res.status(200).send(result);
		})
		.catch(err => console.log(error));
});
module.exports = router;
