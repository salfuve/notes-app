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
        title,
        description
    } = req.body;
    const errors = [];
    if (!title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!description) {
        errors.push({
            text: 'Please add a description'
        });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({
            title,
            description
        });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added successfully');
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
                title: e.title,
                description: e.description,
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
            title: note.title,
            description: note.description
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
        title,
        description
    } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {
        title,
        description
    });
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');
});

router.get('/notes/delete/:id', isAuthenticated, async (req, res) => {

    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});

/**
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});
*/
module.exports = router;