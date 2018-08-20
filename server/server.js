// server.js should only be responsible for routes

// load config, which sets environment variables
require('./config/config');

// load packages and modules
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const {mongoose} = require('./db/mongoose');

// Load object models.
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// Set up express server
var app = express();
const port = process.env.PORT;

// Tell the server that I want JSON to be used
app.use(bodyParser.json());

// POST Todos route
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  // Functions called on Todo are from Mongoose driver
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET Todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos)=> {
    // response sends an object with todo as the lone field, so that more fields can be added
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET todos/todoId
app.get('/todos/:id', (req, res) => {
  // Parse ID query parameter
  var id = req.params.id;

  // Validate object ID
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  // See if object Id exists
  Todo.findById(id).then((Todo) => {
    if(!Todo) {
      res.status(404).send();
    }
    res.send({Todo});
  }).catch((e) => res.status(400).send());
});

// DELETE todos
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  // Tell mongo that the incoming data is already an ID
  Todo.findByIdAndRemove({_id: id}).then((todo) => {
    if (!todo) { // if todo does NOT exist, because nothing was found
      res.status(404).send();
    }
    res.send({todo}); // send back the todo that was deleted.
  }).catch((e) => res.status(400).send);
});

// PATCH Todos
app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;

  // Only accept specific parameters with lodash
  // completedAt is not allowed to be modified directly
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  // Handle completed and completedAt fields
  // Validate that completed is boolean and completed exists
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else { // if completed is either not a boolean or completed doesn't exist set it all to false
    body.completed = false;
    body.completedAt = null;
  }

  // Actually modify the object
  Todo.findOneAndUpdate(id, {
    $set: body // make the body the new body
  }, {
    new: true // return the new object
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}); // return the todo that was updated
  }).catch((e) => {
    res.status(400).send();
  })
});

// Easter Eggs
app.get('/rorrie', (req, res) => {
  // res.send("i'm a scrumdumpster \n and I like it \n");
  res.send("\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,#*%&@@&&&&&@@*,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,@@@@@@@&&&&@&@&@&&*,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,&@&@@&&@@@&@@@&&&&@@@@&*,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,%&@@@@&&%#(////(#&&@@@@@@@,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,%&&&&%(((////////(((#%&&@&&&,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,*&@@&((//////////////((#%&@@&%,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&&(((////********///((((%&%&,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&&%(((///**/******/////((((%&&%,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&((////*/********//////((#&&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&((/(//((//****/#%%#(#%(((&&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,%&((#(/////((////((/////((((#&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,#&((/(((%&%(((///(%/%%#%(//((%#(,,,,,,,,,,,,,,\n,,,,,,,,,,,,,/#((/////((/(((((/////((//(((#//,,,,,,,,,,,,,,\n,,,,,,,,,,,,,(/(((///(///((((((////////((((((,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,((((///*//(((//(((///////((((//,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,(((((///(///(///(///////((((((*,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,*((((///////*//*////////(/((**,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,*((//*//&(**,.,,,*#//*///((**,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,*(//**//////(///////*//((*,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,*((////////**/////**//(((*,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,(#(/////////////////((((,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,#((#((///****////((((((%/,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,(%(//###(/////((##(((/((%#/,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,%%&(////(((((##(((//////#%%%,,,,,,,,,,,,,,,,\n,,,,,,,,,(*#**(#/#((/**////////////*/((,%(%*#**,,,,,,,,,,,,\n,,,,*#*%##//#(/(*&((//****/////****//((%/(,/#/%*//#,,,,,,,,\n#(*(*%*%/(,(/%,*/**//**********//%#%/#%*%/#/#,(,#(//,,,\n%#(&/%,#*#*(/%/*/(/((%#*********#*(*(((((*(/%/%*(,(,#,##(#(\n"
)
});

app.get('/bofa', (req, res) => {
  res.send("\n GET /bofa deez NUTZ! \n");
});

// Tell server to start listening for requests
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
