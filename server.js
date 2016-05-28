const express = require('express');
const session = require('express-session');
const assert = require('assert');

assert(process.env.WILDDOG_URL);
assert(process.env.WILDDOG_SECRET);
assert(process.env.CLIENT_ID);
assert(process.env.CLIENT_SECRET);

// routers
const callback = require('./routers/callback');
const home = require('./routers/home');
const index = require('./routers/index');

const app = express();
app.set('view engine', 'ejs');
app.use(session({
  secret: 'memory fish',
  resave: true,
  saveUninitialized: true
}));

// mouting routers
app.use(express.static('./public'));
app.get('/', index);
app.use('/callback', callback);
app.use('/home/:uid', home);

app.listen(8080)

