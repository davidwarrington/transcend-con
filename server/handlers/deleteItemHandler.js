/**
 * Import external npm modules.
 */
const fs     = require('fs');
const reload = require('require-reload')(require);
const rimraf = require('rimraf');

/**
 * Import necessary data files.
 */
let students = require('../../data/students.json');

/**
 * deleteItemHandler
 * 
 * Handles the deletion of 
 * students or portfolio 
 * items from the data files.
 * 
 * @param {object} req Request object. Used to handle data being received from the user.
 * @param {object} res Response object. Used to respond to the user.
 */
const deleteItemHandler = (req, res) => {
    /**
     * Return route will be altered 
     * later if a students project is 
     * being deleted.
     */
    let return_route = '/admin';

    /**
     * Reload the students data file.
     */
    students = reload('../../data/students.json');

    /**
     * Check router parameters to 
     * decide what is being deleted.
     * 
     * If there is no 'portfolio' 
     * parameter, we must be 
     * deleting a student.
     */
    const type = req.params.portfolio ? 'portfolio' : 'student';

    if (type === 'student') {
        /**
         * Delete the students image 
         * assets using the rimraf 
         * module.
         * 
         * This deletes directories 
         * that are not empty. Making 
         * it easier that looping 
         * through and deleting all of 
         * the file first.
         */
        let student = students.filter(student => student.slug === req.params.student)[0];
        rimraf(`assets/img/${student.slug}`, err => {
            if (err) throw err;
        });

        /**
         * If the user is deleting a 
         * student, filter the array 
         * by removing the student 
         * object from the students 
         * array.
         */
        students = students.filter(student => student.slug !== req.params.student);
    } else if (type === 'portfolio') {
        /**
         * If the user is deleting a 
         * portfolio item, first, 
         * filter the students array 
         * to find the student who 
         * owns the portfolio item.
         * 
         * We need the index of that 
         * student object from within 
         * the students array for 
         * user later.
         */
        let student_index;
        student = students.filter((student, index) => {
            if (student.slug === req.params.student) {
                student_index = index;
                return true;
            }
        })[0];

        /**
         * Determine whether or not 
         * the portfolio item has an 
         * image associated with it. 
         * If it does, delete the 
         * image.
         */
        const current_portfolio = student.portfolio.filter(portfolio => portfolio.slug === req.params.portfolio)[0];
        if (current_portfolio.img) {
           const current_img = `assets/img/${current_portfolio.image.url}`;
            if (fs.existsSync(current_img)) {
                fs.unlink(current_img, err => {
                    if (err) throw err;
                });
            }
        }
        
        
        

        /**
         * Now filter the chosen 
         * students portfolio by 
         * creating a new portfolio 
         * array with all items 
         * that aren't the one 
         * being deleted.
         */
        const portfolio = student.portfolio.filter(portfolio => portfolio.slug !== req.params.portfolio);

        /**
         * Using the index of the 
         * student object we found 
         * earlier, overwrite the 
         * students portfolio array 
         * with new, filtered array.
         */
        students[student_index].portfolio = portfolio;

        return_route += `/student/${req.params.student}`;
    }

    /**
     * Use the fs module to rewrite 
     * the students.json data file 
     * with the new array.
     * 
     * The third argument passed to 
     * JSON.stringify() determines 
     * the number of spaces to be used 
     * for indentation. Using 
     * indentation increases readability.
     */
    fs.writeFile(`data/students.json`, JSON.stringify(students, null, 4), err => {
        if (err) throw err;
    });
    
    /**
     * Finally, redirect the user to 
     * the admin route.
     */
    res.redirect(return_route);
};

module.exports = deleteItemHandler;