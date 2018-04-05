const checkFileTypeHandler = (req, file, callback)=> {
    /**
     * Create array of valid file MIME types.
     * These are used because file extensions 
     * can easily be changed, so checking the 
     * extension won't necessarily yield the 
     * necessary outcome.
     */
    const valid_exts = ['image/jpeg', 'image/png', 'image/gif'];

    /**
     * If the mimetype of the uploaded file 
     * is contained within the valid_exts 
     * array, pass the test. Otherwise, fail 
     * the test and pass an error to describe 
     * the issue.
     */
    if (valid_exts.includes(file.mimetype)) {
        /**
         * This callback passes null instead 
         * of an error, and passes the test.
         */
        callback(null, true);
    } else {
        /**
         * This callback passes an error, and 
         * fails the test.
         * 
         * PugJS cannot render JS Error objects, 
         * so we use a standard JSON object.
         */
        const err = {
            field: file.fieldname,
            message: 'Invalid File Type'
        };
        callback(err, false);
    }
};

module.exports = checkFileTypeHandler;