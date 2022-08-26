const http = require("http");
const fs = require("fs");
const path = require("path");

const booksDBPath = path.join(__dirname, "db", "books.json");
let booksDB = [];

const HOST_NAME = "localhost";
const PORT = 8000;

const requestListener = async function (req, res) {
  res.setHeader("Content-Type, application/json");

  //books
  if (req.url === "/books" && req.method === "GET") {
    getAllbooks(req, res);
  } else if (req.url === "/books" && req.method === "POST") {
    addBook(req, res);
  } else if (req.url.startsWith("/books") && req.method === "DELETE") {
    deleteBook(req, res);
  } else {
    res.writeHead(400);
    res.end(JSON.stringify({ message: "Method not Supported" }));
  }
};

//creating server - has to to be here to prevent refrence error whenw
const server = http.createServer(requestListener);
server.listen(PORT, HOST_NAME, () => {
  booksDB = JSON.parse(fs.readFileSync(booksDBPath, "utf8"));
  console.log(`Server created on ${HOST_NAME}:${PORT}`);
});
