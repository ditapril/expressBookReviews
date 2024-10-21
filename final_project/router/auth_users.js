const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Extract email parameter from request URL
    const username = req.query.username;
    // console.log(users)
    // console.log(req)
    let filteredEntries = users.filter(user => user.username === username);
    // console.log(filteredEntries)
    if (filteredEntries) {  // Check if friend exists
        const content = {
            username: username,
            review: req.body.review
        };

        // const review = Object.entries(books[req.params.isbn].reviews).filter(([key, review]) => review.username === username);
        
        // if(review){
        //     books[req.params.isbn].reviews.push(content);
        // } else {
            books[req.params.isbn].reviews[username] = req.body.review
        // }
        // console.log(review)
        console.log(books)
        res.send(`Book review by ${username} updated.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find user!");
    }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Extract email parameter from request URL
    const username = req.query.username;
    console.log(users)
    let filteredEntries = users.filter((user) => user.username === username);
    console.log(filteredEntries)
    if (filteredEntries) {  // Check if friend exists
    //     let review = {
    //         username : username,
    //         content : req.body.review
    //     }
        delete(books[req.params.isbn].reviews[username])
    // const filteredEntries = Object.entries(books[isbn]).filter(([key, review]) => review.username === username);
    //     filteredEntries = review;  // Update friend details in 'friends' object
        res.send(`Book review by ${username} deleted.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find user!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
