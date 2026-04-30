const http = require('http');
const server = http.createServer((req, res) => {
  res.end('alive');
});
server.listen(5001, () => {
  console.log('Test server on 5001');
});
