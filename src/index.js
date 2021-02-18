const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session= require('express-session');
//Inicializers

const app = express();
require('./database');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    //partials: pequeñas partes de html que podemos reutizar en cualquier vista
    partialsDir:  path.join(app.get('views'), 'partials'),
    //extension de nuestros archivos
    extname: '.hbs'
}));

//utilizar la configuracion de arriba
//configurar el motor de las vistas
app.set('view engine', '.hbs');

//middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
//para autenticar usuario y almacenar sus datos temporalmente
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

//global variables

//Routes 
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
//Static files

app.use(express.static(path.join(__dirname,'public')));
//Server is listening

app.listen(app.get('port'), () => {
    console.log('Server listening on port ', app.get('port'));
})