/**
 * Import npm packages used 
 * within the script.
 * 
 * Require Reload allos the 
 * reloading of files called 
 * using the require() 
 * function. It works by 
 * deleting them from the 
 * cache and then 
 * re-requiring them when 
 * reload is called.
 */
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const reload  = require('require-reload')(require);
const router  = express.Router();

/**
 * Import data to be rendered 
 * on page from JSON files.
 */
let event    = require('../../data/event.json');
let forms    = require('../../data/forms.json');
let students = require('../../data/students.json');

/**
 * Import functions for 
 * handling form submissions.
 */
const formSubmitHandler = require('../handlers/formSubmitHandler');
const deleteItemHandler = require('../handlers/deleteItemHandler');
const newItemHandler    = require('../handlers/newItemHandler');
const editItemHandler   = require('../handlers/editItemHandler');

/**
 * Import middleware to 
 * check if the user is 
 * logged in on routes 
 * handled by this 
 * router.
 */
const isAuthenticated = require('../middleware/isAuthenticated');
router.use(isAuthenticated);

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
    event = reload('../../data/event.json');
    students = reload('../../data/students.json');

    const data = { 
        dash_view: 'event', 
        event: event,
        errors: req.session.errors ? req.session.errors : {},
        form: forms.event,
        students: students
    };
    
    res.render('dashboard', data);
    req.session.errors = {};
});

/**
 * Admin Student Route
 * 
 * Used for editing student 
 * information
 */
router.get('/student/:student', (req, res) => {
    event = reload('../../data/event.json');
    students = reload('../../data/students.json');
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
    if (_new) {
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
        errors: req.session.errors ? req.session.errors : {},
        event: event,
        form: form,
        students: students,
        student: student
    };
    res.render('dashboard', data);
    req.session.errors = {};
});

router.get('/student/:student/portfolio/:portfolio', (req, res) => {
    event = reload('../../data/event.json');
    students = reload('../../data/students.json');
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
    const portfolio = _new ? null 
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
    if (_new) {
        form.name.value         = null;
        form.description.value  = null;
        form.project_type.value = null;
        form.image.url          = null;
        form.image.alt          = null;
        form.yt.value           = null;
    }

    const data = { 
        dash_view: 'portfolio',
        errors: req.session.errors ? req.session.errors : {},
        event: event,
        form: form,
        student: student,
        students: students,
        portfolio: portfolio
    };

    res.render('dashboard', data);
    req.session.errors = {};  
});

/**
 * Form Submit Handler Routes
 */
router.post('/save', (req, res) => {
    formSubmitHandler(req, res);
});

router.post('/student/:student/save', (req, res) => {
    if (req.params.student === 'new_student') {
        newItemHandler(req, res); 
    } else {
        editItemHandler(req, res);
    }
});

router.post('/student/:student/portfolio/:portfolio/save', (req, res) => {
    if (req.params.portfolio === 'new_item') {
        newItemHandler(req, res); 
    } else {
        editItemHandler(req, res);
    }
});

/**
 * Delete Item Handler Routes
 */
router.post('/student/:student/delete', (req, res) => {
    deleteItemHandler(req, res);
});

router.post('/student/:student/portfolio/:portfolio/delete', (req, res) => {
    deleteItemHandler(req, res);
});

module.exports = router;