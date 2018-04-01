// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj.getTimestamp());


//object destructuring
// var user = {name: 'andrew', age: 25};
// var {name} = user; // name = user.name
// console.log(name);

// mongo db doesn't need you to create the database first. it'll do it for you. once we actually start adding data.
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
    // return prevents the rest of the fx from continuing
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   // ops returns stuff that was inserted. undefined for filter and then indentation is 2
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Jason Pan',
  //   age: '23',
  //   location: '78748'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });
  // insert new doc into the Users collection
  // Give it a name property, age property, and location string

  db.close();
});
