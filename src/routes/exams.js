const express = require('express');
const router = express.Router();
const {
    isAuthenticated
} = require('../helpers/auth');

router.post('/exams/new', (req,res) => {
    res.render('exams/new-test');
});
module.exports = router;