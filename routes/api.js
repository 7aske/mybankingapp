const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/user');
const Accounts = require('../models/account');

router.get('/', (req, res) => {
	res.send('Hello API');
});
router.get('/accounts/balance/update/:accNo', (req, res) => {
	if (req.user) {
		req.flash('success_msg', 'New funds recieved on ' + req.params.accNo);
		res.redirect('/users/dashboard');
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
router.get('/users', (req, res) => {
	if (req.user) {
		Users.find({})
			.then(result => {
				res.status(200).send(result);
			})
			.catch(err => console.log(error));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
router.get('/accounts/balance/:accNo', (req, res) => {
	if (req.user) {
		Accounts.findOne({ accountNumber: req.params.accNo })
			.exec()
			.then(result => {
				res.status(200).send({
					balance: result.balance,
					accountNumber: result.accountNumber
				});
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
router.get('/accounts/:accNo', (req, res) => {
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
							phone: result.phone
						});
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized. Please log in.');
		res.redirect('/users/login');
	}
});
module.exports = router;
