const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').findOneAndUpdate({
    name: 'Jen'
  }, {
    $set: {
      name: 'Jason Pan'
    },
    $inc: {
      age: 1
    }
  }, {
      returnOriginal: false
    }).then((result) => {
    console.log(result);
  });

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5ac107ddaf093edc07a40f97')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //     returnOriginal: false
  //   }).then((result) => {
  //   console.log(result);
  // });

  // db.close();
});
