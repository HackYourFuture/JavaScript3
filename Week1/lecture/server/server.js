const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = 3000;

server.use(middlewares);
server.use(router);
server.listen(PORT, () => {
  console.log('JSON Server is running on port', PORT);
});
