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
        idiom_es,
        idiom_en,
        example_en,
        example_es
    } = req.body;
    const errors = [];
    if (!idiom_es) {
        errors.push({
            text: 'Please add an idiom in spanish'
        });
    }
    if (!idiom_en) {
        errors.push({
            text: 'Please add an idiom in english'
        });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            idiom_es,
            idiom_en,
            example_en,
            example_es
        });
    } else {
        const newNote = new Note({
            idiom_es,
            idiom_en,
            example_en,
            example_es
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
                idiom_es: e.idiom_es,
                idiom_en: e.idiom_en,
                example_en: e.example_en,
                example_es: e.example_es,
                id: e._id

            }
        })
    });
});

router.post('/notes/search', isAuthenticated, async (req, res) => {

    const {text} = req.body;
    const arrayNotes = await Note.find({user: req.user.id, idiom_en : {$regex : new RegExp(text)}}).sort({
        date: 'desc'
    });
      
        res.render('notes/all-notes', {
        arrayNotes: arrayNotes.map(e => {
            return {
                idiom_es: e.idiom_es,
                idiom_en: e.idiom_en,
                example_en: e.example_en,
                example_es: e.example_es,
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
            idiom_es: note.idiom_es,
            idiom_en: note.idiom_en,
            example_en: note.example_en,
            example_es: note.example_es
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
        idiom_es,
        idiom_en,
        example_en,
        example_es
    } = req.body;

    await Note.findByIdAndUpdate(req.params.id, {
        idiom_es,
        idiom_en,
        example_en,
        example_es
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
