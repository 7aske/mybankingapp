const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	toAccount: {
		type: Number,
		required: true
	},
	fromAccount: {
		type: Number,
		required: true
	},
	value: { type: Number, required: true, min: 1 },
	date: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Transaction', transactionSchema);
