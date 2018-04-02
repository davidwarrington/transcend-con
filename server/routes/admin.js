/**
 * Import npm packages used 
 * within the script.
 */
const express = require('express');
const router = express.Router();

/**
 * Admin Route
 * 
 * If the user/session has 
 * successfully logged in, 
 * render the admin view, 
 * else, render the login
 * view, along with a login 
 * error if appropriate.
 */
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('admin');  
    } else {
        /**
         * If the session has a login 
         * error, pass an error message 
         * to the login route. Otherwise, 
         * an error won't be passed as 
         * a login attempt has not been 
         * made.
         */
        const error = req.session.loginError 
            ? "Login failed. Please make sure you have admin credentials." 
            : null;
        res.render('login', { error: error });
    }
});

module.exports = router;