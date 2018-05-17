const express = require('express');
const router = express.Router();
const path = require('path');
const Users = require('../models/user');
const Accounts = require('../models/account');
const mongoose = require('mongoose');

router.post('/', (req, res) => {
	console.log(req.body.id);
	let owner = new mongoose.Types.ObjectId(req.body.id);
	console.log(owner);
	let balance = req.body.balance;
	//let payments = req.body.payments;
	//let deposits = req.body.deposits;
	let password = req.body.password;
	let confirm = req.body.confirm;
	let accountNumber = req.body.accountNumber;
	let dateCreated = new Date();

	if (password != confirm) res.redirect('/users/dashboard');

	Users.findOne({ _id: owner })
		.exec()
		.then(result => {
			if (Users.comparePassword(password, result.password)) {
				Accounts.find({ accountNumber: accountNumber })
					.exec()
					.then(result => {
						if (result.length === 0) {
							let accountId = new mongoose.Types.ObjectId();
							let newAccount = new Accounts({
								_id: accountId,
								owner: owner,
								balance: balance,
								accountNumber: accountNumber,
								dateCreated: dateCreated
							});
							newAccount
								.save()
								.then(result => {
									Users.findOneAndUpdate(
										{ _id: owner },
										{ $push: { accounts: accountId } }
									)
										.then(result => console.log(result))
										.catch(err => console.log(err));
									req.flash('success_msg', 'Account successfully updated');
									res.redirect('/users/dashboard');
								})
								.catch(err => console.log(err));
						} else {
							req.flash(
								'error_msg',
								'Account number already exists in the database'
							);
							res.redirect('/users/dashboard');
						}
					})
					.catch(err => console.log(err));
			} else {
				res.sendStatus(500);
			}
		})
		.catch(err => console.log(err));
});

module.exports = router;
