const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const get_books_by_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(res.send(books[isbn]));
  });
  get_books_by_isbn.then(() => console.log("Promise for Task 11 resolved"));
});
  
public_users.get('/author/:author',function (req, res) {
  const get_books_by_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    const respo = [];
    for (let index = 0; index < keys.length; index++) {
      const booki = books[keys[index]];
      if(booki['author'] == author) {
          respo.push(booki)
      }
    }
    resolve(res.send(respo));
  });
  get_books_by_author.then(() => console.log("Promise for Task 12 resolved"));
});

public_users.get('/title/:title',function (req, res) {
  const get_books_by_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    const respo = [];
    for (let index = 0; index < keys.length; index++) {
      const booki = books[keys[index]];
      if(booki['title'] == title) {
          respo.push(booki)
      }
    }
    resolve(res.send(respo));
  });
  get_books_by_title.then(() => console.log("Promise for Task 13 resolved"));
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;