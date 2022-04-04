const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI =
  'mongodb+srv://Ikaros22:mustWork@shop-data.p7zty.mongodb.net/users';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const mainRoutes = require('./routes/main');

const app = express();

app.set('view engine', 'ejs');

//const csrfProtection = csrf();
//app.use(csrfProtection);

app.use(
  session({
    secret: 'K@czk1L@t@j0Klucz3m!@#%*!#@!',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    //res.locals.csrfToken = req.csrfToken();
    next();
  });
  
  app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        err.httpStatusCode = 500;
        next(err);
      });
  });

app.use(mainRoutes);
app.use(profileRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('errors/500', {
    pageTitle: 'Error!',
    path: '/500',
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

// <!-- <input type="hidden" name="_csrf" value="<%= csrfToken %>"> -->