const renderLogin = require('../handlers/renderLogin');

const isAuthenticated = (req, res, next) => {
    if (!req.session.loggedIn) {
        renderLogin(req, res);
    } else {
        next();  
    }
};

module.exports = isAuthenticated;