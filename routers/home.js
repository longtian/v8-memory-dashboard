const WilddogTokenGenerator = require('wilddog-token-generator');
const tokenGenerator = new WilddogTokenGenerator(process.env.WILDDOG_SECRET);
const salt = require('../utils').salt;

const home = (req, res)=> {
  const user = req.session.user;

  if (!user) {
    res.redirect('/');
    return;
  }

  const message = {
    uid: salt(user.id)
  };

  const token = tokenGenerator.createToken(message, {
    expires: new Date(2017, 0, 1)
  });

  res.render('home', {
    token: token,
    user: user,
    uid: salt(user.id),
    url: process.env.WILDDOG_URL,
    MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN
  });
};

module.exports = home;