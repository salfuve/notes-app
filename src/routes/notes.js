//Urls de las rutas que permiten crear/manejar notas
//Urls de la pag principal
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const {
    isAuthenticated
} = require('../helpers/auth');


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {
        expresion,
        idiom,
        example
    } = req.body;
    const errors = [];
    if (!expresion) {
        errors.push({
            text: 'Please add a sentence'
        });
    }
    if (!idiom) {
        errors.push({
            text: 'Please add an idiom'
        });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            expresion,
            idiom,
            example
        });
    } else {
        const newNote = new Note({
            expresion,
            idiom,
            example
        });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Idiom added successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const arrayNotes = await Note.find({user: req.user.id}).sort({
        date: 'desc'
    });
    res.render('notes/all-notes', {
        arrayNotes: arrayNotes.map(e => {
            return {
                expresion: e.expresion,
                idiom: e.idiom,
                example: e.example,
                id: e._id
            }
        })
    });
});

router.post('/notes/search', isAuthenticated, async (req, res) => {

    const {text} = req.body;
    const arrayNotes = await Note.find({user: req.user.id, idiom : {$regex : new RegExp(text)}}).sort({
        date: 'desc'
    });
      
        res.render('notes/all-notes', {
        arrayNotes: arrayNotes.map(e => {
            return {
                expresion: e.expresion,
                idiom: e.idiom,
                example: e.example,
                id: e._id
            }
        })
    });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {

    try {
        const note = await Note.findById(req.params.id);

        const noteObject = {
            id: note._id,
            expresion: note.expresion,
            idiom: note.idiom,
            example: note.example
        }
        res.render('notes/edit-note', {
            note: noteObject
        });

    } catch (error) {
        console.log(error);
    }
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {
        expresion,
        idiom,
        example
    } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {
        expresion,
        idiom,
        example
    });
    req.flash('success_msg', 'Idiom updated successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Idiom deleted successfully');
    res.redirect('/notes');
});
module.exports = router;
/**
router.get('/notes/delete/:id', isAuthenticated, async (req, res) => {

    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Idiom deleted successfully');
    res.redirect('/notes');
});
*/