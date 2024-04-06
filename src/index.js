const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require("./config/db");
const methodOverride = require('method-override');

//For notifice
const flash = require('express-flash');




const route = require('./routes');

 



//Connect database
db.connect()
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
    secret: 'workshop',
    resave: false,
    saveUninitialized: true,
  }));


// Set up flash middleware
app.use(flash());
// Custom middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//Morgan quest HTTP
const morgan = require('morgan');
app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Template Engine
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));

//config source static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'middlewares', 'uploads')));

//
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//Routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
