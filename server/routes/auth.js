/**
 * Import npm packages used 
 * within the script.
 */
const express  = require('express');
const router   = express.Router();
const passport = require('passport');

/**
 * Import the authHandler function 
 * from the controllers directory.
 */
const authHandler = require('../controllers/authHandler');

/**
 * Login Route
 * 
 * This route uses PassportJS to send 
 * the user to Twitter. The user signs 
 * in with their account from here.
 * 
 * passport.authenticate() found here:
 * http://www.passportjs.org/docs/authenticate/
 */
router.get('/login', passport.authenticate('twitter'));

/**
 * Return Route
 * 
 * The Twitter app returns the user to 
 * a route once they have logged in.
 * 
 * passport.authenticate() is used once 
 * again. This time to determine if 
 * authentication was a success. If so, 
 * more work is done to determine if the 
 * log in was successful.
 */
router.get('/return', passport.authenticate('twitter', {
    /**
     * If Twitter authentication failed, 
     * redirect the user to the root 
     * directory.
     */
    failureRedirect: '/'
}), (req, res) => {
    /**
     * Get the username from the user 
     * object created by Passport.
     * 
     * Parse the array of valid twitter 
     * handles contained within 
     * process.env
     */
    const username = req.user.username;
    const admins = JSON.parse(process.env.ADMIN_USERS);

    /**
     * To determine whether or not 
     * login has been a success, pass 
     * the username and array of admin 
     * names to the authHandler.
     * 
     * If it returns true, the 
     * user/session is logged in.
     */
    req.session.loggedIn = authHandler(username, admins);

    /**
     * If the login failed, set 
     * session.loginError to true. 
     * This will cause an error 
     * message to be rendered in 
     * the view.
     * 
     * Also destroy the session, 
     * logout via passport. This 
     * is detailed further in the 
     * '/logout' route below.
     */
    if (!req.session.loggedIn) {
        req.session.loginError = true;

        res.logout();
        res.session.destroy(err => {
            if (err) return res.negotiate(err);
        });
    }

    res.redirect('/admin');
});

/**
 * Logout Route
 * 
 * This route is used to handle logging 
 * out of the admin panel
 */
router.get('/logout', (req, res) => {
    /**
     * Logout of PassportJS session
     * 
     * .logout() deletes the req.user 
     * property, if it exists, and 
     * stops the login session
     * 
     * .logout() found here:
     * http://www.passportjs.org/docs/logout/
     */
    req.logout();

    /**
     * Destroy user session object
     */
    req.session.destroy(err => {
        /**
         * Negotiate inspects an error and 
         * decides how to respond based on 
         * the error code.
         * 
         * Negotiate found here:
         * https://sailsjs.com/documentation/reference/response-res/res-negotiate
         */
        if (err) return res.negotiate(err);
    });
    res.redirect('/admin');
})

module.exports = router;