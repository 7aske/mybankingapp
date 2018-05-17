const express = require('express');
const router = express.Router();
const path = require('path');
const Accounts = require('../models/account');
const Users = require('../models/user');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});
router.get('/register', (req, res) => {
	res.render('register', { title: 'Register' });
});
router.get('/dashboard', (req, res) => {
	if (res.locals.user != null) {
		Accounts.find({ owner: res.locals.user._id })
			.exec()
			.then(result => {
				console.log(result);
				res.render('dashboard', {
					title: 'Dashboard',
					accounts: result
				});
			})
			.catch(err => console.log(err));
	} else {
		req.flash('error_msg', 'Unauthorized');
		res.redirect('/');
	}
});

//register user
router.post('/register', (req, res) => {
	console.log(req.body);
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let email = req.body.email;
	let username = req.body.username;
	let company = req.body.company;
	let address = req.body.address;
	let city = req.body.city;
	let country = req.body.country;
	let birthDate = req.body.birthDate;
	let phone = req.body.phone;
	let password = req.body.password;
	let confirm = req.body.confirm;
	let lastLogin = new Date();

	//validation
	req.checkBody('firstName', 'First Name is required').notEmpty();
	req.checkBody('lastName', 'Last Name is required').notEmpty();
	req.checkBody('company', 'Company Name is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('country', 'Country is required').notEmpty();
	req.checkBody('birthDate', 'Birth date is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('email', 'E-Mail is required').notEmpty();
	req.checkBody('email', 'E-Mail is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirm', 'Confirm your password').notEmpty();
	req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		Users.find({ $or: [{ email: email }, { username: username }] })
			.then(result => {
				console.log(result);
				if (result.length === 0) {
					let newUser = new Users({
						firstName: firstName,
						lastName: lastName,
						company: company,
						email: email,
						username: username,
						password: password,
						address: address,
						city: city,
						country: country,
						birthDate: birthDate,
						phone: phone,
						lastLogin: lastLogin,
						transactions: [],
						accounts: []
					});
					Users.createUser(newUser, (err, user) => {
						if (err) throw err;
						if (user) console.log(user);
					});
					req.flash(
						'success_msg',
						'Registration successful. You can now log in.'
					);
					res.redirect('login');
				} else {
					req.flash('error_msg', 'User already exists.');
					res.render('register', {
						errors: [{ msg: 'User already exists' }]
					});
				}
			})
			.catch(err => console.log(err));
	}
});
passport.use(
	new LocalStrategy((username, password, done) => {
		Users.findOne({ $or: [{ username: username }, { email: username }] })
			.then(result => {
				if (!result) {
					return done(null, false, { message: 'User not found.' });
				} else {
					if (Users.comparePassword(password, result.password)) {
						Users.findOneAndUpdate(
							{ username: result.username },
							{ $set: { lastLogin: new Date() } }
						)
							.exec()
							.then(result => console.log(result))
							.catch(err => console.log(err));
						return done(null, result, { message: 'Successfully logged in.' });
					} else {
						return done(null, false, { message: 'Invalid password.' });
					}
				}
			})
			.catch(err => console.log(err));
	})
);
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	Users.findById(id, (err, user) => {
		done(err, user);
	});
});
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/users/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true,
		successFlash: true
	}),
	(req, res) => {
		res.redirect('/');
	}
);
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out.');
	res.redirect('login');
});
module.exports = router;
