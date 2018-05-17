const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('express-handlebars');

const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const messages = require('express-messages');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const HTTPStrategy = require('passport-http').Strategy;

const api = require('./routes/api');
const router = require('./routes/router');
const users = require('./routes/users');
const accounts = require('./routes/accounts');

const app = express();

process.env.HASHSCRT = 'cupcakes';
process.env.ROOT_DIR = __dirname;
const port = process.env.PORT || 3000;
const dbpass = process.env.DBADMIN_PASS || 'dbpass321';

//connect to mongodb atlas
const url = `mongodb+srv://dbadmin:${dbpass}@cluster0-mek89.mongodb.net/bank`;
mongoose
	.connect(url)
	.then()
	.catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));

//set up the handlebars view engine
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'handlebars',
	hbs({
		extname: 'handlebars',
		defaultLayout: 'main',
		layoutsDir: 'views'
	})
);
app.set('view engine', 'handlebars');

//set up bodyParser and cookieparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//set up express-session
app.use(
	session({
		secret: 'secret',
		saveUninitialized: true,
		resave: true
	})
);

//set up passport
app.use(passport.initialize());
app.use(passport.session());

//set up express-validator
app.use(
	expressValidator({
		errorFormatter: (param, msg, value) => {
			let namespace = param.split('.'),
				root = namespace.shift(),
				formParam = root;
			while (namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);

//set up connect-flash
app.use(flash());

//global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//set up routes
app.use('/', router);
app.use('/api', api);
app.use('/users', users);
app.use('/accounts', accounts);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
