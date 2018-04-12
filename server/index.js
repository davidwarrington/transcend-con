/**
 * Import external npm packages
 * 
 *  - dotenv applies variables set in the .env file to process.env
 *  - express is used for running a web server
 *  - morgan is used for logging information to the console/terminal when users send requests
 *  - passport is used for handling logins
 *  - path is useful for working with directories
 *  - express-session is used for handling individual user/device sessions (each device connected has a separate session)
 *  - passport-twitter is used for handling Twitter authentication through passportjs
 */
const dotenv          = require('dotenv').config();
const express         = require('express');
const morgan          = require('morgan');
const passport        = require('passport');
const path            = require('path');
const session         = require('express-session');
// const TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Import config data and define port to serve from
 */
const config = require('./config');
const port = config.port;

/**
 * Import Routers
 */
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter  = require('./routes/auth');

/**
 * Import Passport Twitter Strategy
 */
const TwitterStrategy = require('./passport');

const app    = express();
const server = app.listen(port, () => console.log(`Server listening on port ${port}`));

/**
 * Set View Engine to PugJS
 * Serve views from views directory
 * Serve assets such as CSS from assets directory
 */
app.set('view engine', 'pug');
app.set('views', 'views');
app.use('/assets', express.static('assets'));

/**
 * Set up app middleware
 * 
 * Use Express Session for controlling user sessions
 * Use PassportJS for handling authentication
 * Use Morgan for logging messages to terminal
 */
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

/**
 * Set up routers
 */
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/twitter', authRouter);

/**
 * PassportJS set up
 * 
 * .serializeUser() is used to 
 * create a key for retrieving 
 * the users data later with the 
 * .deserializeUser() method.
 */
passport.use(TwitterStrategy);
passport.serializeUser((user, callback) => callback(null, user));
passport.deserializeUser((obj, callback) => callback(null, obj));