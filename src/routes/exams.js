const express = require('express');
const router = express.Router();
const {
    isAuthenticated
} = require('../helpers/auth');

const Exam = require('../models/Exam');

router.post('/exams/new', (req, res) => {
    //res.render('exams/exam-1');
    res.render('exams/exams');
});

router.get('/exams/exam1', (req, res) => {
    res.render('exams/exam1/exam-1');
})
router.get('/exams/exam2', async (req, res) => {

    const questions = await Exam.aggregate([{ $sample: { size: 10 } }]);

    res.render('exams/exam2/exam-2', {

        questions: questions.map((e, i) => {
            return {
                definition: e.definition.replace(e.definition, i + '. ' + e.definition + ':'),
                question: e.question.replace(/####/g, '<input type="text" name="userAnswer[' + i + ']">'),
                answer: e.answer,
                id: e._id
            }
        })
    });
});

router.post('/exams/validate', (req, res) => {

    const ans1 = ['stopped', 'dead', 'tracks'];
    const ans2 = ['crossed', 'the', 'line'];
    const ans2_a = ['overstep', 'the', 'mark'];
    const ans2_b = ['were', 'out', 'of', 'line'];
    const ans3 = ['put'];
    const ans4 = ['on', 'the', 'back', 'burner'];
    const ans5 = ['on', 'the', 'mend'];
    const ans6 = ['made'];
    const ans7 = ['headway', 'progress', 'strides'];
    const ans8 = ['warts', 'and', 'all'];
    const ans9 = ['beggars', 'can\'t', 'be', 'choosers'];
    const ans10 = ['right', 'off', 'the', 'bat'];
    const ans11 = ['have', 'no', 'say'];
    const ans12 = ['become', 'set', 'in', 'their', 'ways'];

    err2 = ans2.every(e => req.body.answer_2.toLowerCase().includes(e));
    err2a = ans2_a.every(e => req.body.answer_2.toLowerCase().includes(e));
    err2b = ans2_b.every(e => req.body.answer_2.toLowerCase().includes(e));

    err3 = ans3.every(e => req.body.answer_3.toLowerCase().includes(e));
    err4 = ans4.every(e => req.body.answer_4.toLowerCase().includes(e));

    err6 = ans6.every(e => req.body.answer_6.toLowerCase().includes(e));
    err7 = ans7.some(e => req.body.answer_7.toLowerCase().includes(e));

    if (err2 || err2a || err2b) {
        error_2 = false;
    } else {
        error_2 = true;
    }

    if (err3 && err4) {
        error3_4 = false;
    } else {
        error3_4 = true;
    }

    if (err6 && err7) {
        error6_7 = false;
    } else {
        error6_7 = true;
    }
    const answers = {};

    const answersObject =
    {
        correctAns1: 'Stopped dead in my tracks',
        answer_1: req.body.answer_1,
        ...(ans1.every(e => req.body.answer_1.toLowerCase().includes(e)) ? {} : { error_1: true }),
        correctAns2: 'Crossed the line / Overstepped the mark / were out of line',
        answer_2: req.body.answer_2,
        error_2,
        correctAns3: 'Put',
        error3_4,
        answer_3: req.body.answer_3,
        correctAns4: 'on the back burner',
        answer_4: req.body.answer_4,
        correctAns5: 'On the mend',
        ...(ans5.every(e => req.body.answer_5.toLowerCase().includes(e)) ? {} : { error_5: true }),
        answer_5: req.body.answer_5,
        correctAns6: 'Made',
        error6_7,
        answer_6: req.body.answer_6,
        correctAns7: 'Headway / Progress/ Strides',
        answer_7: req.body.answer_7,
        correctAns8: 'Warts and all',
        ...(ans8.some(e => req.body.answer_8.toLowerCase().includes(e)) ? {} : { error_8: true }),
        answer_8: req.body.answer_8,
        correctAns9: 'Beggars can\'t be choosers',
        ...(ans9.some(e => req.body.answer_9.toLowerCase().includes(e)) ? {} : { error_9: true }),
        answer_9: req.body.answer_9,
        correctAns10: 'Right off the bat',
        answer_10: req.body.answer_10,
        ...(ans10.some(e => req.body.answer_10.toLowerCase().includes(e)) ? {} : { error_10: true }),
        correctAns11: 'Have no say',
        answer_11: req.body.answer_11,
        ...(ans11.some(e => req.body.answer_11.toLowerCase().includes(e)) ? {} : { error_11: true }),
        correctAns12: 'Become set in their ways',
        ...(ans12.some(e => req.body.answer_12.toLowerCase().includes(e)) ? {} : { error_12: true }),
        answer_12: req.body.answer_12
    };

    res.render('exams/exam1/exam-1-answers', {
        answers: answersObject
    });

});

router.post('/exams/validate-test', async (req, res) => {
    console.log('id: ', req.body.item);
    console.log('def: ', req.body.definition);
    const goodAnswers = req.body.answer;
    const userAnswers = [];
    const correctedAnswers = [{
        userAnswer: String,
        error: Boolean
    }];

    let i;
    for (i = 0; i < 10; i++) {
        const userAnswer = req.body["userAnswer[" + i + "]"];
        if (typeof userAnswer === 'object') {
            
            const answer = {
                userAnswer: userAnswer.join(' '),
                error: true
            }
            userAnswers.push(answer);
        } else {
            const ans = userAnswer
            const answer = {
                userAnswer: ans,
                error: true
            }
            userAnswers.push(answer);
        }
    }

    let j;
    for (j = 0; j < Object.keys(goodAnswers).length; j++) {
        if (userAnswers[j].userAnswer.toLowerCase().toString() == goodAnswers[j].toLowerCase().toString()) {
            console.log('OK')
            userAnswers[j].error = false
        } else {
            console.log('NOT OK')
            userAnswers[j].error = true
        }
    }

    userAnswers.forEach(element => {
        console.log(element)
    });

});
module.exports = router;