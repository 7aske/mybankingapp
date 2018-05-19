const express = require('express');
const router = express.Router();
const path = require('path');
const Users = require('../models/user');
const Accounts = require('../models/account');
const Transactions = require('../models/transaction');
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

	req.checkBody('accountNumber', 'Invalid account number').isNumeric();
	req.checkBody('balance', 'Invalid balance').isNumeric();
	req.checkBody('password', 'Password is empty').notEmpty();
	req.checkBody('confirm', 'Confirm password is empty').notEmpty();
	req.checkBody('password', 'Passwords do not match').equals('confirm');
	let errors = req.validationErrors();
	if (errors) {
		req.flash('error_msg', 'Invalid password');
		res.redirect('/users/dashboard');
	} else {
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
										req.flash(
											'success_msg',
											'Account successfully updated'
										);
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
	}
});
router.delete('/:accountId', (req, res) => {
	let user = res.locals.user;
	let id = req.params.accountId;
	if (user != null) {
		Users.findOne({ _id: user._id })
			.exec()
			.then(result => {
				if (Users.compareId(user._id, result._id)) {
					Accounts.findOneAndRemove({ _id: id })
						.exec()
						.then(result => {
							console.log(result);
							Users.findOneAndUpdate(
								{ _id: user._id },
								{ $pull: { accounts: id } }
							)
								.exec()
								.then(result => {
									console.log(result);
									req.flash(
										'success_msg',
										'Account successfully removed'
									);
									//res.render('dashboard', { title: 'Dashboard' });
									res.sendStatus(200);
								})
								.catch(err => console.log(err));
						})
						.catch(err => console.log(err));
				} else {
					res.sendStatus(401);
				}
			})
			.catch(err => console.log(err));
	} else {
		res.sendStatus(401);
	}
});
router.post('/send', (req, res) => {
	let value = req.body.value;
	let toAccountId = req.body.toAccount;
	let fromAccountId = req.body.fromAccount;
	let password = req.body.password;
	let confirm = req.body.confirm;

	req.checkBody('toAccount', 'Invalid account number').isNumeric();
	req.checkBody('fromAccount', 'Invalid account number').isNumeric();
	req.checkBody('value', 'Invalid value').isNumeric();
	req.checkBody('password', 'Password is empty').notEmpty();
	req.checkBody('confirm', 'Confirm password is empty').notEmpty();
	req.checkBody('password', 'Passwords do not match').equals('confirm');
	let errors = req.validationErrors();
	if (errors) {
		req.flash('error_msg', 'Invalid password');
		res.redirect('/users/dashboard');
	} else {
		if (Users.comparePassword(password, res.locals.user.password)) {
			console.log([fromAccountId, toAccountId]);
			let transaction = new Transactions({
				_id: new mongoose.Types.ObjectId(),
				fromAccount: fromAccountId,
				value: value,
				toAccount: toAccountId,
				date: new Date()
			});
			Accounts.find({
				accountNumber: { $in: [fromAccountId, toAccountId] }
			})
				.exec()
				.then(result => {
					console.log(result);
					if (result.length === 2) {
						Accounts.findOneAndUpdate(
							{ accountNumber: fromAccountId },
							{
								$push: { transactions: transaction },
								$inc: { balance: -Math.abs(value) }
							}
						)
							.then(result => console.log(result))
							.catch(err => console.log(err));
						Accounts.findOneAndUpdate(
							{ accountNumber: toAccountId },
							{
								$push: { transactions: transaction },
								$inc: { balance: Math.abs(value) }
							}
						)
							.then(result => {
								console.log(result);
							})
							.catch(err => console.log(err));
						if (res.locals.user != null) {
							Accounts.find({ owner: res.locals.user._id })
								.exec()
								.then(result => {
									req.flash(
										'success_msg',
										'Funds transfered successfully'
									);
									res.redirect('/users/dashboard');
								})
								.catch(err => console.log(err));
						} else {
							req.flash(
								'error_msg',
								'Unauthorized. Please log in.'
							);
							res.redirect('/');
						}
					} else {
						req.flash('error_msg', 'Invalid account');
						res.redirect('/users/dashboard');
					}
				})
				.catch(err => console.log(err));
		} else {
			req.flash('error_msg', 'Passwords do not match');
			res.redirect('/users/dashboard');
		}
	}
});
module.exports = router;
