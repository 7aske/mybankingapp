const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/user');
const Accounts = require('../models/account');

router.get('/', (req, res) => {
	res.send('Hello API');
});

router.get('/users', (req, res) => {
	if (req.user) {
		Users.find({})
			.then(result => {
				if (result.length !== 0) {
					res.status(200).send(result);
				}
			})
			.catch(err => console.log(err));
	} else {
		res.status(404).send({ error: 'No users found' });
	}
});
router.get('/users/:user', (req, res) => {
	let user = req.params.user;
	if (req.user) {
		Users.findOne({ username: user })
			.then(result => {
				if (result) {
					res.status(200).send(result);
				} else {
					res.status(404).send({ error: 'User not found.' });
				}
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
router.get('/accounts/:accNo/balance', (req, res) => {
	if (req.user) {
		Accounts.findOne({ accountNumber: req.params.accNo })
			.exec()
			.then(result => {
				if (result) {
					res.status(200).send({
						accountNumber: result.accountNumber,
						balance: result.balance
					});
				} else {
					res.status(404).send({ accountNumber: 0, balance: 0 });
				}
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.status(401).redirect('/users/login');
	}
});
router.post('/accounts/:accNo/balance/update', (req, res) => {
	if (req.user) {
		req.flash('success_msg', 'New funds recieved on ' + req.params.accNo);
		res.redirect('/users/dashboard');
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
router.get('/accounts/:accNo/owner', (req, res) => {
	if (req.user) {
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
							phone: result.phone,
							birthDate: result.birthDate,
							email: result.email
						});
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.status(401).redirect('/users/login');
	}
});
module.exports = router;
