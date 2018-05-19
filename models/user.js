const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, lowercase: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		company: { type: String, required: true },
		email: { type: String, required: true },
		birthDate: { type: Date, required: true },
		address: { type: String, required: true },
		city: { type: String, required: true },
		country: { type: String, required: true },
		phone: { type: String, required: true },
		lastLogin: { type: Date, default: new Date() },
		dateCreated: { type: Date, default: new Date() },
		accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }]
	},
	{ collection: 'users' }
);

module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (newUser, callback) => {
	const secret = process.env.HASHSCRT;
	const hash = crypto
		.createHmac('sha256', secret)
		.update(newUser.password)
		.digest('hex');
	newUser.password = hash;
	newUser
		.save()
		.then(result => console.log(result))
		.catch(err => console.log(err));
};
module.exports.comparePassword = (loginPassword, databasePassword) => {
	const secret = process.env.HASHSCRT;
	const hash = crypto
		.createHmac('sha256', secret)
		.update(loginPassword)
		.digest('hex');
	return hash == databasePassword;
};
module.exports.compareId = (id1, id2) => {
	if (typeof id1 == 'object' && typeof id1 == 'object') {
		return id1.toString() == id2.toString();
	} else {
		return false;
	}
};
