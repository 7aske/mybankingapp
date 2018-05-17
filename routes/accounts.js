const express = require('express');
const router = express.Router();
const path = require('path');
const Users = require('../models/user');
const Accounts = require('../models/account');
const mongoose = require('mongoose');

router.post('/', (req, res) => {
	let owner = req.body.owner;
	//let balance = req.body.balance;
	//let payments = req.body.payments;
	//let deposits = req.body.deposits;
	let accountNumber = req.body.accountNumber;
	let dateCreated = new Date();

	Users.findOne({ username: owner })
		.exec()
		.then(result => {
			let accountId = new mongoose.Types.ObjectId();
			Users.findOneAndUpdate(
				{ username: owner },
				{ $push: { accounts: accountId } }
			)
				.then(result => console.log(result))
				.catch(err => console.log(err));
			let newAccount = new Accounts({
				_id: accountId,
				owner: result._id,
				accountNumber: accountNumber,
				dateCreated: dateCreated
			});
			newAccount
				.save()
				.then(result => {
					console.log(result);
					res.send(result);
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

module.exports = router;
