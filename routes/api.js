const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/user');
const Accounts = require('../models/account');

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
router.get('/accounts/:accNo', (req, res) => {
	Accounts.findOne({ accountNumber: req.params.accNo })
		.exec()
		.then(result => {
			Users.findOne({ _id: result.owner })
				.exec()
				.then(result => {
					res.send({
						firstName: result.firstName,
						lastName: result.lastName,
						company: result.company,
						address: result.address,
						city: result.city,
						country: result.country,
						phone: result.phone
					});
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});
module.exports = router;
