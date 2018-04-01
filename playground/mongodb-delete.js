const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // })

  // delete dupes
  db.collection('Users').deleteMany({name: 'Jason Pan'});
  // delete one
  db.collection('Users').findOneAndDelete({_id: new ObjectID("5abe6ba20de7032522177b77")}).then((results) => {
    console.log(JSON.stringify(results, undefined, 2));
  });

  // db.close();
});
