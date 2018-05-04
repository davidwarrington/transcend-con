# East Riding College Transcend Conference 2018

This project was created by David Warrington, for the East Riding College Transcend HE Conference 2018. It can be seen live here: [159.65.24.94](http://159.65.24.94/).

## Table of Contents
- [How to Develop](#how-to-develop)
- [Server Structure](#server-structure)
- [dotenv](#dotenv)

## How to Develop

To edit this project, once the repository has been downloaded, run the following commands:
1. `npm install`: This will install all of the project dependencies.
2. `npm run dev`: This will run the server in a *nodemon* instance, meaning that whenever a server file changes, the server will restart.

To edit the assets used on the front-end, such as *SASS* or *JS* files, run the following command:
1. `gulp`: This will run the default gulp file. Watching `.scss` files in `src/sass`, `.js` files in `src/js` and image files in `src/images`.

## Server Structure

The server is separates views, data and the server itself.
- JSON files found in `data/` should not be edited directly, instead, edit them by using the forms on the `/admin` routes whilst the server is running. 
- Views are built using *PugJS*.

## dotenv

This server uses the *dotenv* package for obscuring information such as the Twitter App keys. In order to add your own Twitter app to be used for authentication, create a new app at [apps.twitter.com](https://apps.twitter.com/). Once this is done, you will need the Consumer Key and Consumer Secrets, place these in your `.env` file.

It should looks something like this:
```js
CONSUMER_KEY = 'key here'
CONSUMER_SECRET = 'secret here'
```

The `.env` file also contains an array of valid Twitter handles to be accepted as admins. They should look something like this:
```js
ADMIN_USERS = [ 'admin-01', 'admin-02' ]
```

Finally, it requires a secret key to be used by *Express Session*, which should look like this:
```js
SESSION_SECRET = 'secret here'
```