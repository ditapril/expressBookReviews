const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Extract the lastName parameter from the request URL
    const isbn = req.params.isbn;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    // let filtered_lastname = books.filter((book) => book.isbn === isbn);
    // Send the filtered_lastname array as the response to the client
    // res.send(filtered_lastname);

    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});

    // Extract the lastName parameter from the request URL
    const author = req.params.author;

    const filteredEntries = Object.entries(books).filter(([key, book]) => book.author === author);
    res.send(Object.fromEntries(filteredEntries));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});

    // Extract the lastName parameter from the request URL
    const title = req.params.title;
    const filteredEntries = Object.entries(books).filter(([key, book]) => book.title === title);
    res.send(Object.fromEntries(filteredEntries));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
