var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;

var index = require('./routes/index');
var res = require('./routes/restaurant');
var recipe = require('./routes/recipe');
var dish = require('./routes/dish');
var users = require('./routes/users');

//passport strategy
passport.use(new Strategy(
  function(token, cb) {
    // db.users.findByToken(token, function(err, user) {
    //   if (err) { return cb(err); }
    //   if (!user) { return cb(null, false); }
    //   return cb(null, user);
    // });
}));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/recipe', recipe);
app.use('/restaurant', res);
app.use('/dish', dish);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, email: req.user.emails[0].value });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
