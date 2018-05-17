const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Schema.Types.ObjectId },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		balance: { type: Number, default: 0 },
		payments: { type: Array, default: [] },
		deposits: { type: Array, defualt: [] },
		accountNumber: { type: String, required: true },
		dateCreated: { type: Date, default: new Date() }
	},
	{ collection: 'accounts' }
);

module.exports = mongoose.model('Account', accountSchema);
