import { readFile, writeFile } from "fs";
import { join } from "path";
const usersDBPath = join(__dirname, "db", "users.json");

let usersDB = [];

//get all users - GET request

const getAllUsers = function (req, res) {
  fs.readFile(usersDBPath 'utf8', (err, users)=>{
    if (err) {
      console.log(err);
      res.writeHead(404);
      res.end(JSON.stringify({ msg: "An error occured" }));
    }
    res.end(users);
  });
};

// create a new user -POST request

const addUser = function (req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const newUser = JSON.parse(parsedBody);

    const lastUser = usersDBPath[usersDBPath.length - 1];
    const lastUserID = lastUser.id;
    newUser.id = lastUserID + 1;

    //add to db
    usersDBPath.push(newUser);
    writeFile(usersDBPath, JSON.stringify(usersDB), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(
          JSON.stringify({
            msg: "Internal server error occured, couldn't save the book to data base",
          })
        );
      }
      res.end(JSON.stringify(newUser));
    });
  });
};

export { addUser };
