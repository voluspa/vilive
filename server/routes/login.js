var express = require('express');

module.exports = function(app) {
  var loginRouter = express.Router();
  loginRouter.post('/', function(req, res) {
    if (req.param('username') === 'login-success-user') {
      return res.status(200)
                .send({
                  username: 'login-success-user',
                  token: '1234567890'
                });
    }

    res.status(401)
       .send({ error: "Username/Password was invalid" });
  });
  app.use('/api/login', loginRouter);
};
