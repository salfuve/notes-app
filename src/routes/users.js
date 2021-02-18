//Urls donde se puede autenticar tipo /login /signout etc..
//Urls de la pag principal
const express = require('express');
const router = express.Router();

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req,res) => {
    res.render('users/signup');
});

module.exports = router;