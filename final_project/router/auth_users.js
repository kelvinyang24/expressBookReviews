const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
    
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
    accessToken,username
    }
    console.log(username)
    return res.status(200).send("User successfully logged in");
    }
    else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  token = req.session.authorization.accessToken;
  username = req.session.authorization.username;
  if(token){
     // books[req.params.isbn].review[token.username] = review;
        const book = books[req.params.isbn]
        if(review){
            book.reviews[username]=review
            console.log(books[req.params.isbn].reviews)
            
            return res.status(200).send(`The review for the book with ISBN ${req.params.isbn} has been added/updated`)
        }
 
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    token = req.session.authorization.accessToken;
    username = req.session.authorization.username;
    if(token){
        if (books[req.params.isbn].reviews.hasOwnProperty(username)) {
            delete books[req.params.isbn].reviews[username];
            console.log(books[req.params.isbn].reviews)
            return res.status(200).send(`Reviews for the book with ISBN ${req.params.isbn} has been deleted`)
          }

    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
