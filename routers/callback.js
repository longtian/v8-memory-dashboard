const request = require('request');
const salt = require('../utils').salt;

/**
 * 处理 github 的 redirect
 *
 * @param req
 * @param res
 */
const callback = (req, res) => {
  const code = req.query.code;

  /**
   * 处理取得 token 的认证请求
   * @param error
   * @param response
   * @param responseBody
   */
  const handler = (error, response, responseBody) => {
    if (error) {
      res.statusCode = 400;
      res.end('invalid code');
    } else {
      const authInfo = JSON.parse(responseBody);
      /**
       * 处理用户信息,如果成功就跳转
       * @param authError
       * @param authResponse
       * @param authResponseBody
       */
      const onUserInfomation = (authError, authResponse, authResponseBody) => {
        if (authError) {
          res.end('invalid access_token');
        } else {
          const userInfo = JSON.parse(authResponseBody);
          req.session.user = userInfo;
          res.redirect(`/home/${salt(userInfo.id)}`)
        }
      };
      request({
        url: 'https://api.github.com/user',
        headers: {
          'User-Agent': 'v8-memory-dashboard',
          'Authorization': `token ${authInfo.access_token}`
        }
      }, onUserInfomation);
    }
  };

  const params = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code
  };

  if (!code) {
    res.statusCode = 400;
    res.end('error code');
    return;
  }

  request.post({
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      'Accept': 'application/json'
    }
  }, handler).form(params);

};

module.exports = callback;