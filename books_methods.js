import { readFile, writeFile } from "fs";
import { join } from "path";
const booksDBPath = join(__dirname, "db", "books.json");

let booksDB = [];

// return all books -GET request

const getAllbooks = function (req, res) {
  readFile(booksDBPath, "utf8", (err, books) => {
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
    writeFile(booksDBPath, JSON.stringify(booksDB), (err) => {
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

//update a book

const updateBook = function (req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();

    const bookToUpdate = JSON.parse(parsedBody);

    const bookIndex = booksDB.findIndex((book) => {
      return book, id === bookToUpdate.id;
    });

    if (bookIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ msg: "Book not found" }));
      return;
    }

    booksDB[bookIndex] = { ...booksDB[bookIndex], ...bookToUpdate };
    writeFile(booksDBPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(
          JSON.stringify({
            msg: "Internal server error, could not update bok in the database.",
          })
        );
      }
      res.end(JSON.stringify(bookToUpdate));
    });
  });
};

const deleteBook = function (req, res) {
  const bookId = req.url.split("/")[2];

  const bookIndex = booksDB.findIndex((book) => {
    return book.id === parseInt(bookId);
  });

  if (bookIndex === -1) {
    res.writeHead(404);
    res.end(JSON.stringify({ msg: "Book not found" }));
    return;
  }

  booksDB.splice(bookIndex, 1);
  writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(
        JSON.stringify({
          message:
            "Internal Server Error. Could not delete book from database.",
        })
      );
    }

    res.end(
      JSON.stringify({
        message: "Book deleted",
      })
    );
  });
};
export default { getAllbooks, addBook, updateBook, deleteBook };
