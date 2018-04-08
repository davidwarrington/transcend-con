/**
 * renderLogin
 * 
 * This function is used on all dashboard 
 * routes if the user is not logged in.
 * 
 * @param {object} req Request Object
 * @param {object} res Response Object
 */
const renderLogin = (req, res) => {
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
};

module.exports = renderLogin;