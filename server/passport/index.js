/**
 * Import Strategy property from 
 * passport-twitter npm package.
 */
const TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Import passport property from
 * Server Config file export.
 */
const config = require('../config').passport;

/**
 * A TwitterStrategy is used by PassportJS 
 * to determine how to authenticate a user.
 * 
 * Strategy documentation can be found here:
 * http://www.passportjs.org/docs/configure/
 * 
 * Two arguments are passed to it:
 *  - A config object, containing Twitter App 
 *    keys and a callback URL to return the 
 *    user to.
 *  - A Verify callback. In this case the 
 *    callback is supplying PassportJS with 
 *    the profile information of the user who 
 *    logged in.
 */
const twitterStrategy = new TwitterStrategy(config,
    (token, tokenSecret, profile, done) => done(null, profile));

module.exports = twitterStrategy;