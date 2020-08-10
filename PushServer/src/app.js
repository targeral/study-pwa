const express = require('express')
const app = express()
const router = require('./router');
const {init: pushInit} = require('./pusher');

pushInit();
app.get('/', function (req, res) {
  res.send('Hello World')
});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});

router(app);

app.listen(3000, () => {
  console.log('app running in 3000 port');
});
