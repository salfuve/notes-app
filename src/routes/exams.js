const express = require('express');
const router = express.Router();
const {
    isAuthenticated
} = require('../helpers/auth');

const Exam = require('../models/Exam');

router.get('/exams/take-exam', async (req, res) => {

    const questions = await Exam.aggregate([{ $sample: { size: 10 } }]);

    res.render('exams/exam-questions', {

        questions: questions.map((e, i) => {
            return {
                definition: e.definition.replace(e.definition, i + '. ' + e.definition + ':'),
                question: e.question.replace(/####/g, '<input type="text" name="userAnswer[' + i + ']">'),
                answer: e.answer,
                hint: e.hint,
                id: e._id
            }
        })
    });
});

router.post('/exams/validate-test', async (req, res) => {

    const goodAnswers = req.body.answer;
    const userAnswers = [];

    let i;
    for (i = 0; i < 10; i++) {

        const userAnswer = req.body["userAnswer[" + i + "]"];
        const definition = req.body.definition[i];
        const goodAnswer = goodAnswers[i];
        if (typeof userAnswer === 'object') {

            const answer = {
                goodAnswer: goodAnswer,
                definition: definition,
                userAnswer: userAnswer.join(' '),
                error: true,
                nErrors: 0
            };
            userAnswers.push(answer);
        } else {
            const ans = userAnswer
            const answer = {
                goodAnswer: goodAnswer,
                definition: definition,
                userAnswer: ans,
                error: true,
            };
            userAnswers.push(answer);
        }
    }

    let j;
    let nErrors = 0;
    for (j = 0; j < Object.keys(goodAnswers).length; j++) {
        if (userAnswers[j].userAnswer.toLowerCase().toString() == goodAnswers[j].toLowerCase().toString()) {
            userAnswers[j].error = false;
        } else {
            userAnswers[j].error = true;
            nErrors++;
        }
    }
    let nHits = 10- nErrors;
    res.render('exams/exam-answers', {
        userAnswers,
        nErrors,
        nHits
    });
});

router.post('/exams/back-to-idioms', (req, res) => {
    res.redirect('/notes');
})
module.exports = router;