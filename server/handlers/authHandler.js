/**
 * authHandler
 * 
 * authHandler uses the .includes() array method to search an 
 * array for the string passed as an argument. If the string 
 * is found within the array, it returns true, else false.
 * 
 * @param {string} username The username within the req.user object.
 * @param {array} admins An array of Twitter usernames that can be used to access the admin panel.
 */
const authHandler = (username, admins) => admins.includes(username);

module.exports = authHandler;