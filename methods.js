const fs = require("fs");
const path = require("path");
const booksDBPath = path.join(__dirname, "db", "books.json");

let booksDB = [];

// return all books -GET request

const getAllbooks = function (req, res) {
  fs.readFile(booksDBPath, "utf8", (err, books) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }
    res.end(books);
  });
};

// create a book -POST request

const addBook = function (req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const newBook = JSON.parse(parsedBody);

    const lastBook = booksDB[booksDB.length - 1];
    const lastBookID = lastBook.id;
    const newBookID = lastBook + 1;

    //add to db
    booksDB.push(newBook);
    fs.writeFile(booksDBPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(
          JSON.stringify({
            msg: "Internal server error occured, couldn't save the book to data base",
          })
        );
      }
    });
  });
};

module.exports = { getAllbooks };
