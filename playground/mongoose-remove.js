const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
//
// Todo.remove({}).then((result) => {
//   console.log(result);
// })

// Todo.findOneAndRemove

// Todo.findOneAndRemove({_id: ""}).then((todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove('5b5e55dec3f9caec316593b6').then((todo) => {
  console.log(todo);
});
