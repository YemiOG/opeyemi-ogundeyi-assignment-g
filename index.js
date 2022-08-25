const http = require("http");

const server = http.createServer(requestListener);

const requestListener = function (req, res) {
  res.end("Assignment G");
};

const HOST_NAME = "localhost";

const PORT = 8000;

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server created on ${HOST_NAME}:${PORT}`);
});
