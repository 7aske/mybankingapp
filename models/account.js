const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Schema.Types.ObjectId },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		balance: { type: Number, default: 0 },
		transactions: { type: Array, default: [] },
		accountNumber: { type: Number, required: true },
		dateCreated: { type: Date, default: new Date() }
	},
	{ collection: 'accounts' }
);

module.exports = mongoose.model('Account', accountSchema);
