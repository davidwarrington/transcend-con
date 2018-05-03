const fs     = require('fs');
const multer = require('multer');
const path   = require('path');
const reload = require('require-reload')(require);

/**
 * Import data to be rendered 
 * on page from JSON files.
 */
let event    = require('../../data/event.json');
let forms    = require('../../data/forms.json');

/**
 * Import the File Filter to 
 * be used my Multer.
 */
const checkFileTypeHandler = require('../handlers/checkFileTypeHandler');

const editItemHandler = (req, res) => {
    event = reload('../../data/event.json');

    /**
     * Create an extension variable 
     * for getting the file extension 
     * for the uploaded image.
     */
    let ext;

    /**
     * Multer Configuration
     */
    const storage = multer.diskStorage({
        /**
         * Set the destination for 
         * uploaded files and set 
         * their filename.
         */
        destination: './assets/img',
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
            callback(null, 'about' + ext);
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

        /**
         * Loop through the submitted 
         * data and add it to the event object.
         * 
         * If the loop hits an "image_alt" key, 
         * create an image object within the 
         * event object. Then populate the alt 
         * property and url property of the 
         * image object.
         */
        for (const key in req.body) {
            if (key === 'image_alt') {
                event.image = {};
                event.image.alt = req[key];
                event.image.url = 'about.jpg';
            } else {
               event[key] = req[key]; 
            }
        }

        /**
         * Rewrite the 
         * event.json 
         * data file.
         */
        fs.writeFile(`data/event.json`, JSON.stringify(event, null, 4), err => {
            if (err) throw err;
        });

        /**
         * Update event and students data in cache
         */
        event    = reload('../../data/event.json');
        students = reload('../../data/students.json');

        res.redirect('/admin');
    });
};

module.exports = editItemHandler;