const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
console.log(req.body)
  if(username && password){
    
    if(isValid(username)){
        users.push({"username":username, "password":password})
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
      return res.status(403).json({message: "Username invalid already exists"})
    }
  }
  else{
      
    return res.status(403).json({message: "Must provide username and password"})
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.send(Object.values(books).filter(book=> book.author === req.params.author));
    let result = {booksByAuthor:[]}
    keys = Object.keys(books);
    keys.forEach(key => {
        if (books[key].author === req.params.author){
            result.booksByAuthor.push({
                isbn:key,
                title:books[key].title,
                reviews:books[key].reviews
            })
        }
    });
    res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let result = {booksByTitle:[]}
    keys = Object.keys(books);
    keys.forEach(key => {
        if (books[key].title === req.params.title){
            result.booksByTitle.push({
                isbn:key,
                author:books[key].author,
                reviews:books[key].reviews
            })
        }
    });
    res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
