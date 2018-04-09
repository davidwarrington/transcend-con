const renderLogin = require('../handlers/renderLogin');

/**
 * isAuthenticated
 * 
 * A middleware that is run in 
 * the 'admin' router. When running 
 * it checks the users session to 
 * determine whether they have 
 * successfully logged in. If they 
 * haven't, the login view is 
 * rendered.
 * 
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Function that tells express to proceed to the next middleware
 */
const isAuthenticated = (req, res, next) => {
    if (!req.session.loggedIn) {
        renderLogin(req, res);
    } else {
        next();  
    }
};

module.exports = isAuthenticated;