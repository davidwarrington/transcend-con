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
let students = require('../../data/students.json');

const slugify = text => text.toLowerCase().replace(/ /g, '-');

/**
 * Import the File Filter to 
 * be used my Multer.
 */
const checkFileTypeHandler = require('../handlers/checkFileTypeHandler');

const formSubmitHandler = (req, res) => {
    event    = reload('../../data/event.json');
    students = reload('../../data/students.json');

    const config = {};
    if (req.route.path === '/save') {
        config.upload_dest = '';
        config.field_name = 'image';
        config.file = 'event.json';
        config.img_name = 'about';
        config.return_route = '';
        config.ext_name = null;
    } else if (req.route.path === '/student/:student/save') {
        config.student = students.filter(student => student.slug === req.params.student)[0];
        config.upload_dest = `${req.params.student}`;
        config.field_name = 'image';
        config.file = 'students.json';
        config.img_name = `${slugify(req.params.student)}`;
        config.ext_name = null;
    } else if (req.route.path === '/student/:student/portfolio/:portfolio/save') {
        config.student = students.filter(student => student.slug === req.params.student)[0];
        config.portfolio = students.filter(portfolio => portfolio.slug === req.params.portfolio)[0];
        config.upload_dest = `${slugify(req.params.student)}/portfolio`;
        config.field_name = 'image';
        config.file = 'students.json';
        config.img_name = `${slugify(req.params.portfolio)}`;
        config.ext_name = null;
    };

    console.log(config.upload_dest);

    /**
     * Multer Configuration
     * 
     * Configure Multer based 
     * on url parameters.
     */
    const storage = multer.diskStorage({
        /**
         * Set the destination for 
         * uploaded files and set 
         * their filename.
         */
        destination: `./assets/img/${config.upload_dest}`,
        filename: (req, file, callback) => {
            config.ext_name = path.extname(file.originalname);
            callback(null, config.img_name + path.extname(file.originalname));
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

    upload.single(config.field_name)(req, res, err => {
        if (err) req.session.errors[err.field] = err;

        console.log(req.session.errors)

        let new_data = {};
        for (const key in req.body) {
            if (key.endsWith('_alt')) {
                const image = {};
                image.alt = req.body[key];

                if (config.ext_name !== null) {
                    image.url = `${config.img_name}${config.ext_name}`;
                } else {
                    image.url = event.image.url;
                }
                
                new_data.image = image;
            } else {
                new_data[key] = req.body[key];
            }
        }

        if (!new_data.image) new_data.image = {};

        if (req.route.path === '/student/:student/save') {
            if (req.params.student !== 'new_student'){
                students.forEach((student, index) => {
                    if (student.slug === config.student.slug) {
                        students[index] = new_data;
                        students[index].slug = slugify(new_data.name);

                        config.return_route = `/student/${students[index].slug}`;
                    }
                }); 
            } else {
                new_data.slug = slugify(new_data.name);
                students.push(new_data);
                config.return_route = `/student/${new_data.slug}`;
            }

            new_data = students;
        } else if (req.route.path === '/student/:student/portfolio/:portfolio/save') {
            students.forEach((student, index) => {
                if (student.slug === req.params.student) {
                    if (!students[index].portfolio) {
                        students[index].portfolio = [];
                    };

                    if (req.params.portfolio !== 'new_item') {
                        student.portfolio.forEach((portfolio, p_index) => {
                            if (portfolio.slug === req.params.portfolio) {
                                students[index].portfolio[p_index] = new_data;
                                students[index].portfolio[p_index].slug = slugify(new_data.name);

                                const image = {
                                    url: `${students[index].slug}/portfolio/${slugify(new_data.name)}${config.ext_name}`,
                                    alt: new_data.name
                                }

                                students[index].portfolio[p_index].image = image;

                                config.return_route = `/student/${students[index].slug}/portfolio/${slugify(new_data.name)}`;

                                if (fs.existsSync(`assets/img/${students[index].slug}/portfolio/${req.params.portfolio}${config.ext_name}`)) {
                                    // Rename file
                                }
                            }
                        }); 
                    } else {
                        new_data.slug = slugify(new_data.name);

                        const image_path = `${students[index].slug}/portfolio/`;
                        fs.renameSync(`assets/img/${image_path}new_item${config.ext_name}`, `assets/img/${image_path}${new_data.slug}${config.ext_name}`)

                        new_data.image.url = `${image_path}${new_data.slug}${config.ext_name}`;
                        new_data.image.alt = new_data.name;

                        students[index].portfolio.push(new_data);
                        config.return_route = `/student/${students[index].slug}/portfolio/${slugify(new_data.name)}`;
                        
                    }
                    
                }
            });

            new_data = students;
        }

        fs.writeFileSync(`data/${config.file}`, JSON.stringify(new_data, null, 4), err => {
            if (err) throw err
        });
        
        res.redirect(`/admin${config.return_route}`);
    });
}

module.exports = formSubmitHandler;