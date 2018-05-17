const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	value: { type: Number, required: true },
	dateCreated: { type: Date, default: new Date() }
});

module.exports = mongoose.model(transactionSchema, 'Transaction');
