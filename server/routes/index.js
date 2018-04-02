const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { name: "Home" });
});

router.get('/student/:name', (req, res) => {
    res.render('index', { name: "Student" });
});

module.exports = router;