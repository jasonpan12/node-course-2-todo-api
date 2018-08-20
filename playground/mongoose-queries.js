const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b54cc6e874ce5d847da3b08';
User.findById(id).then((user) => {
  if(!user) {
    return console.log('user not found');
  }
  console.log('user', user);
}).catch((e) => console.log(e));


// handle query works, but no user, user found, and any errors,
// var id = "5b5534a1eb0845936474180611";
//
// if(!ObjectId.isValid(id)) {
//   console.log('id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log("todos", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log("todo", todo);
// }); //returns a document instead of an array

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log("todo", todo);
// }).catch((e) => console.log(e))
