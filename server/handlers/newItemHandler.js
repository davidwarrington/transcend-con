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
const checkFileTypeHandler = require('../handlers/checkFileTypeHandler');
const slugify = require('./slugify');

const newItemHandler = (req, res) => {
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
    const temp_dest = './assets/img/temp';
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
            callback(null, 'temp' + ext);
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
            const student = req.body;
            student.slug = slugify(student.name);
            student.image = {
                url: `${student.slug}/${student.slug}${ext}`,
                alt: student.name
            };
            student.portfolio = [];

            /**
             * Next rename the uploaded 
             * image in the temp directory.
             */
            const student_dir = `./assets/img/${student.slug}`;
            fs.renameSync(temp_dest, student_dir);
            fs.renameSync(`${student_dir}/temp${ext}`, `${student_dir}/${student.slug}${ext}`);

            return_route += `/student/${student.slug}`;

            students.push(student);
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
            const portfolio = req.body;
            portfolio.slug = slugify(portfolio.name);

            /**
             * Only alter files if the project 
             * type is set to 'image', as the 
             * 'video' project type does not 
             * require a file upload.
             */
            if (portfolio.project_type === 'image') {
                portfolio.image = {
                    url: `${student.slug}/portfolio/${portfolio.slug}${ext}`,
                    alt: portfolio.name
                };

                /**
                 * Next rename the uploaded 
                 * image in the temp directory.
                 */
                const portfolio_dir = `./assets/img/${student.slug}/portfolio`;

                /**
                 * If the portfolio directory 
                 * doesn't already exists, 
                 * rename the temp directory.
                 */
                if (!fs.existsSync(portfolio_dir)) {
                    fs.renameSync(temp_dest, portfolio_dir);
                }
                fs.renameSync(`${temp_dest}/temp${ext}`, `${portfolio_dir}/${portfolio.slug}${ext}`);
            }

            return_route += `/student/${student.slug}/portfolio/${portfolio.slug}`;

            student.portfolio.push(portfolio);
        }

        /**
         * Sort the array 
         * alphabetically.
         */
        students.sort(compare);

        fs.writeFileSync(`data/students.json`, JSON.stringify(students, null, 4), err => {
            if (err) throw err;
        });

        res.redirect(return_route);
    });
};

module.exports = newItemHandler;