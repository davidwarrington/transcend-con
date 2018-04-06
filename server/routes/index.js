const express = require('express');
const reload = require('require-reload')(require);
const router = express.Router();

const data = {
    event: reload('../../data/event.json'),
    students: reload('../../data/students.json')
}

router.get('/', (req, res) => {
    res.render('index', data);
});

router.get('/student/:student', (req, res) => {
    data.student = data.students.filter(student => student.slug === req.params.student)[0];
    res.render('student', data);
});

module.exports = router;