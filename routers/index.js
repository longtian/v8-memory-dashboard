const index = (req, res) => {
  res.render('index', {
    client_id: process.env.CLIENT_ID
  });
}

module.exports = index;