const fs     = require('fs');
const multer = require('multer');
const path   = require('path');
const reload = require('require-reload')(require);

const compare = require('../handlers/sortArray');

/**
 * Import data to be rendered 
 * on page from JSON files.
 */
let event    = require('../../data/event.json');
let forms    = require('../../data/forms.json');
let students = require('../../data/students.json');

/**
 * Import the File Filter to 
 * be used my Multer.
 */
const checkFileTypeHandler = require('./checkFileTypeHandler');
const slugify              = require('./slugify');

const editItemHandler = (req, res) => {
    event    = reload('../../data/event.json');
    students = reload('../../data/students.json');

    /**
     * Create an extension variable 
     * for getting the file extension 
     * for the uploaded image.
     * 
     * Create a return_route variable 
     * to be updated later.
     */
    let ext;
    let return_route = '/admin';

    /**
     * Check router parameters to 
     * decide what is being deleted.
     * 
     * If there is no 'portfolio' 
     * parameter, we must be 
     * deleting a student.
     */
    const type = req.params.portfolio ? 'portfolio' : 'student';

    /**
     * Multer Configuration
     */
    const temp_dest = type === 'portfolio' 
        ? `./assets/img/${req.params.student}/portfolio`
        : `./assets/img/${req.params.student}`;
    const temp_name = type === 'portfolio'
        ? req.params.portfolio 
        : req.params.student;
    const storage = multer.diskStorage({
        /**
         * Set the destination for 
         * uploaded files and set 
         * their filename.
         */
        destination: temp_dest,
        filename: (req, file, callback) => {
            /**
             * Set the ext variable 
             * to the file extension
             * of the uploaded file. 
             * We can refer to this 
             * later when renaming.
             * 
             * Also upload the file 
             * as temp.ext, where ext 
             * is the file extension.
             */
            ext = path.extname(file.originalname);
            callback(null, temp_name + ext);
        }
    });
    const upload = multer({ 
        /**
         * Determine the upload 
         * function to be used. 
         * This function applies 
         * a file filter to 
         * prevent non-image file
         * uploads, and uses the 
         * storage object to 
         * determine where to 
         * upload files.
         */
        // limits: { fileSize: 1024 * 1024 * 10 },
        fileFilter: (req, file, callback) => checkFileTypeHandler(req, file, callback),
        storage: storage
    });

    /**
     * Create an Errors object 
     * within the users session, 
     * ready to be populated by 
     * if the form has any 
     * validation errors.
     */
    req.session.errors = {};

    upload.single('image')(req, res, err => {
        if (err) req.session.errors[err.field] = err;

        if (type === 'student') {
            /**
             * Create an object with all 
             * of the req.body values added.
             * 
             * Then run the student name 
             * through the slugify function 
             * to determine a slug used for 
             * routing and file names.
             * 
             * Then create the student image 
             * object and an empty portfolio 
             * array.
             */
            let student_index;
            let student_portfolio;
            let student_slug;
            let student = students.filter((student, index) => {
                if (student.slug === req.params.student) {
                    student_index = index;
                    student_portfolio = student.portfolio;
                    student_slug = student.slug;
                    return true;
                }
            })[0];

            student = req.body;
            student.slug = slugify(student.name);
            student.image = {
                url: `${student.slug}/${student.slug}${ext}`,
                alt: student.name
            };
            student.portfolio = student_portfolio;

            /**
             * Next rename the uploaded 
             * image in the students 
             * directory and the 
             * directory itself.
             */
            const old_dir = `./assets/img/${student_slug}`;
            const student_dir = `./assets/img/${student.slug}`;

            /**
             * If no image was uploaded, 
             * get the extension of the 
             * old file.
             * 
             * We also need to overwrite 
             * the student image url if 
             * this is the case.
             */
            if (!ext) {
                const files = fs.readdirSync(old_dir);
                const file = files.filter(file => path.parse(file).name === student_slug)[0];
                ext = path.extname(file);

                student.image.url = `${student.slug}/${student.slug}${ext}`;
            }

            fs.renameSync(old_dir, student_dir);
            fs.renameSync(`${student_dir}/${student_slug}${ext}`, `${student_dir}/${student.slug}${ext}`);

            return_route += `/student/${student.slug}`;

            students[student_index] = student;
        } else if (type === 'portfolio') {
            /**
             * Create a reference object 
             * of the student who's 
             * portfolio is being added to.
             * 
             * Also keep the index of that 
             * student object for later use.
             */
            let student_index;
            const student = students.filter((student, index) => {
                if (student.slug === req.params.student) {
                    student_index = index;
                    return true;
                }
            })[0];

            /**
             * Create an object with all 
             * of the req.body values added.
             * 
             * Then run the portfolio name 
             * through the slugify function 
             * to determine a slug used for 
             * routing and file names.
             * 
             * Then create the portfolio image 
             * object.
             */
            let portfolio_index;
            let portfolio_slug;
            let portfolio = student.portfolio.filter((portfolio, index) => {
                if (portfolio.slug === req.params.portfolio) {
                    portfolio_index = index;
                    portfolio_slug = portfolio.slug;
                    return true;
                }
            })[0];

            portfolio = req.body;
            portfolio.slug = slugify(portfolio.name);
            portfolio.image = {
                url: `${student.slug}/portfolio/${portfolio.slug}${ext}`,
                alt: portfolio.name
            };

            /**
             * Next rename the uploaded 
             * image in the student 
             * directory.
             */
            const portfolio_dir = `./assets/img/${student.slug}/portfolio`;
            /**
             * If no image was uploaded, 
             * get the extension of the 
             * old file.
             * 
             * We also need to overwrite 
             * the student image url if 
             * this is the case.
             */
            if (ext) {
                const files = fs.readdirSync(portfolio_dir);
                const file = files.filter(file => path.parse(file).name === portfolio_slug)[0];
                ext = path.extname(file);

                portfolio.image.url = `${student.slug}/portfolio/${portfolio.slug}${ext}`;
                fs.renameSync(`${portfolio_dir}/${portfolio_slug}${ext}`, `${portfolio_dir}/${portfolio.slug}${ext}`);
            }

            /**
             * The route that the user will 
             * be redirected to is that of 
             * the portfolio page.
             */
            return_route += `/student/${student.slug}/portfolio/${portfolio.slug}`;

            students[student_index].portfolio[portfolio_index] = portfolio;
        }

        /**
         * Sort the array 
         * alphabetically.
         */
        students.sort(compare);

        /**
         * Rewrite the 
         * students.json 
         * data file.
         */
        fs.writeFile(`data/students.json`, JSON.stringify(students, null, 4), err => {
            if (err) throw err;
        });

        res.redirect(return_route);
    });
};

module.exports = editItemHandler;