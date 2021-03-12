const express = require('express');
const router = express.Router();
const {
    isAuthenticated
} = require('../helpers/auth');

router.post('/exams/new', (req, res) => {
    res.render('exams/exam-1');
});

router.post('/exams/validate', (req, res) => {

    const ans1 = ['stop','dead','tracks'];
    const answers = {};

    const answersObject =
    {
        answer_1: req.body.answer_1,
        ...(ans1.every(e =>  req.body.answer_1.toLowerCase().includes(e)) ? {}: {error_1:true}),
        answer_2: req.body.answer_2,
        answer_3: req.body.answer_3,
        answer_4: req.body.answer_4,
        answer_5: req.body.answer_5,
        answer_6: req.body.answer_6,
        answer_7: req.body.answer_7,
        answer_8: req.body.answer_8,
        answer_9: req.body.answer_9,
        answer_10: req.body.answer_10,
        answer_11: req.body.answer_11,
        answer_12: req.body.answer_12
    };

    res.render('exams/exam-1-answers', {
        answers: answersObject
    });

});

module.exports = router;