const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

//Inicializers

const app = express();
require('./database');
require('./config/passport');
//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    handlebars: allowInsecurePrototypeAccess(Handlebars),
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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
//para mandar mensajes entre las vistas usamos el 'connect-flash' y para que estos mensajes sean visibles en todo momento
//creamos la variable global
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //mensajes flash de passport
    res.locals.user = req.user || null;
    next(); //aseguramos que el navegador no se quede bloqueado ya que node es de un solo hilo
});
//Routes 
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
app.use(require('./routes/exams'));
//Static files

app.use(express.static(path.join(__dirname,'public')));
//Server is listening

app.listen(app.get('port'), () => {
    console.log('Server listening on port ', app.get('port'));
})