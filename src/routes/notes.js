//Urls de las rutas que permiten crear/manejar notas
//Urls de la pag principal
const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note')
});

router.post('/notes/new-note', async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!description) {
        errors.push({ text: 'Please add a description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description});
        await newNote.save();
        res.redirect('/notes');
    }
});

router.get('/notes', async(req, res) => {
    const arrayNotes = await Note.find().sort({date: 'desc'});
    console.log(arrayNotes)
   res.render('notes/all-notes', {arrayNotes: arrayNotes.map(e => {return {title: e.title, description: e.description, id: e._id}})}  );
});

router.get('/notes/edit/:id', async(req, res) => {

    try {
        const note = await Note.findById(req.params.id);

        const noteObject = {
            id: note._id,
            title: note.title,
            description: note.description
        }
        res.render('notes/edit-note', {note: noteObject});
        
    } catch (error) {
        console.log(error);
    }
})

router.put('/notes/edit-note/:id', (req, res) => {

});
module.exports = router;