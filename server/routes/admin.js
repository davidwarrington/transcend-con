/**
 * Import npm packages used 
 * within the script.
 */
const express = require('express');
const router = express.Router();

/**
 * Import data to be rendered 
 * on page from JSON files.
 */
const event = require('../../data/event.json');
const forms = require('../../data/forms.json');
const students = require('../../data/students.json');

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
        const form = forms.event;
        form.name.value        = event.name;
        form.ticket_link.value = event.ticket_link;
        form.description.value = event.description;
        form.image.value       = event.photo.url;
        form.image.alt         = event.photo.alt;
        form.twitter.value     = event.twitter;
        form.facebook.value    = event.facebook;

        const data = { 
            dash_view: 'event', 
            // event: event, 
            form: form,
            students: students
        };
        res.render('dashboard', data);  
    } else {
        renderLogin(req, res);
    }
});

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
router.get('/student/:student', (req, res) => {
    if (req.session.loggedIn) {
        /**
         * Determine if a new student 
         * is being created.
         */
        const _new = req.params.student === 'new_student' ? true : false;

        /**
         * The student object is created 
         * by applying the Array filter 
         * function on the students array. 
         * This filter returns an array 
         * of students whose name matches 
         * that requested in the route.
         * We then return the first (and 
         * only) item in that array.
         */
        const student = students.filter(student => student.slug === req.params.student)[0];

        const form = forms.student;
        if (!_new) {
            form.name.value        = student.name;
            form.role.value        = student.role;
            form.bio.value         = student.bio;
            form.image.value       = student.photo.url;
            form.image.alt         = student.name;
            form.twitter.value     = student.twitter;
            form.facebook.value    = student.facebook;
            form.email.value       = student.email;
        } else {
            form.name.value        = null;
            form.role.value        = null;
            form.bio.value         = null;
            form.image.value       = null;
            form.image.alt         = null;
            form.twitter.value     = null;
            form.facebook.value    = null;
            form.email.value       = null;
        }
        
        const data = { 
            dash_view: 'student',
            // event: event,
            form: form,
            students: students,
            student: student
        };
        res.render('dashboard', data);  
    } else {
        renderLogin(req, res);
    }
});

router.get('/student/:student/portfolio/:portfolio', (req, res) => {
    if (req.session.loggedIn) {
        /**
         * Determine if a new 
         * portfolio item is 
         * being created.
         */
        const _new = req.params.portfolio === 'new_item' ? true : false;
        
        /**
         * The filtering method 
         * is used here for both 
         * student and their 
         * portfolio item.
         */
        const student   = students.filter(student => student.slug === req.params.student)[0];
        const portfolio = _new ? {} 
            : student.portfolio.filter(portfolio => portfolio.slug === req.params.portfolio)[0];

        const form = forms.portfolio;

        /**
         * If the route isn't 
         * being used to create
         * a new item, fill the 
         * form value properties.
         * 
         * Otherwise, empty them.
         * This has to be done 
         * otherwise the form values 
         * aren't lost when visiting 
         * the new route after a 
         * non-new route.
         */
        if (!_new) {
            form.name.value         = portfolio.name;
            form.description.value  = portfolio.description;
            form.project_type.value = portfolio.project_type;
            if (portfolio.project_type === 'image') {
                form.image.url      = portfolio.image.url;
                form.image.alt      = `${portfolio.name} by ${student.name}`;
            } else if (portfolio.project_type === 'video') {
                form.yt             = portfolio.yt;
            }
        } else {
            form.name.value         = null;
            form.description.value  = null;
            form.project_type.value = null;
            form.image.url          = null;
            form.image.alt          = null;
            form.yt.value           = null;
        }

        const data = { 
            dash_view: 'portfolio',
            // event: event,
            form: form,
            student: student,
            students: students,
            portfolio: portfolio
        };

        res.render('dashboard', data);  
    } else {
        renderLogin(req, res);
    }
});

/**
 * Form Submit Handler Routes
 */
router.post('/save', () => {

});

module.exports = router;