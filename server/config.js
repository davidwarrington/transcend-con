const config = {
    /**
     * The passport configuration object.
     */
    passport: {
        callbackURL: `/twitter/return`,
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET
    },
    /**
     * The port used for serving the app.
     * Port 3000 is used unless a port is 
     * specified within the environment. 
     * This is because some hosts enforce 
     * will only serve apps on particular 
     * ports.
     * 
     * Another port can be specified when 
     * running the server via the terminal 
     * by passing a parameter to it.
     * For example: node server PORT=4000 
     * would serve the app on port 4000.
     */
    port: process.env.PORT || 3000,
    /**
     * The session object is used for 
     * configuring express-session. A 
     * secret is used to protect the 
     * information. This secret is 
     * contained within process.env.
     * 
     * resave forces the session to be 
     * saved, even if it wasn't modified.
     * 
     * saveUninitialized forces a session 
     * to be "saved when it is new, but 
     * not modified".
     * 
     * Documentation on these properties 
     * can be found here: 
     * https://github.com/expressjs/session
     */
    session: {
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET
    }     
}

module.exports = config;