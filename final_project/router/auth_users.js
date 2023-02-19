const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const isbm_reviews = books[isbn]['reviews']
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    username = req.session.authorization['username'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            isbm_reviews[username] = review
            return res.status(200).send("Review added successfully");
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const isbm_reviews = books[isbn]['reviews']
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    username = req.session.authorization['username'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            delete isbm_reviews[username];
            res.send(`Review for username ${username} deleted.`);
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;