const express = require('express');
const router = express.Router();
const {
    isAuthenticated
} = require('../helpers/auth');

router.post('/exams/new', (req, res) => {
    res.render('exams/exam-1');
});

router.post('/exams/validate', (req, res) => {

    const answers = req.body;

console.log(answers.answer_1.toLowerCase().includes('stop'));

    const answersObject = 
        {answer_1: answers.answer_1,
        answer_2: answers.answer_2,
        answer_3: answers.answer_3,
        answer_4: answers.answer_4,
        answer_5: answers.answer_5,
        answer_6: answers.answer_6,
        answer_7: answers.answer_7,
        answer_8: answers.answer_8,
        answer_9: answers.answer_9,
        answer_10: answers.answer_10,
        answer_11: answers.answer_11,
        answer_12: answers.answer_12
    };
    
    res.render('exams/exam-1-answers', {
        answers: answersObject
        });
});

module.exports = router;