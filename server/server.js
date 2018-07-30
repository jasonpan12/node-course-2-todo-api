// server.js should only be responsible for routes

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000 // if process.env.port exists, use it, else 3000

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos)=> {
    res.send({todos}) // sending an object as todos so i can add more things to the eventual bigger response
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/rorrie', (req, res) => {
  // res.send("i'm a scrumdumpster \n and I like it \n");
  res.send("\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,#*%&@@&&&&&@@*,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,@@@@@@@&&&&@&@&@&&*,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,&@&@@&&@@@&@@@&&&&@@@@&*,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,%&@@@@&&%#(////(#&&@@@@@@@,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,%&&&&%(((////////(((#%&&@&&&,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,*&@@&((//////////////((#%&@@&%,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&&(((////********///((((%&%&,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&&%(((///**/******/////((((%&&%,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&((////*/********//////((#&&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,&((/(//((//****/#%%#(#%(((&&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,%&((#(/////((////((/////((((#&&,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,#&((/(((%&%(((///(%/%%#%(//((%#(,,,,,,,,,,,,,,\n,,,,,,,,,,,,,/#((/////((/(((((/////((//(((#//,,,,,,,,,,,,,,\n,,,,,,,,,,,,,(/(((///(///((((((////////((((((,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,((((///*//(((//(((///////((((//,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,(((((///(///(///(///////((((((*,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,*((((///////*//*////////(/((**,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,*((//*//&(**,.,,,*#//*///((**,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,*(//**//////(///////*//((*,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,*((////////**/////**//(((*,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,(#(/////////////////((((,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,#((#((///****////((((((%/,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,(%(//###(/////((##(((/((%#/,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,%%&(////(((((##(((//////#%%%,,,,,,,,,,,,,,,,\n,,,,,,,,,(*#**(#/#((/**////////////*/((,%(%*#**,,,,,,,,,,,,\n,,,,*#*%##//#(/(*&((//****/////****//((%/(,/#/%*//#,,,,,,,,\n#(*(*%*%/(,(/%,*/**//**********//%#%/#%*%/#/#,(,#(//,,,\n%#(&/%,#*#*(/%/*/(/((%#*********#*(*(((((*(/%/%*(,(,#,##(#(\n"
)
});

//get /todos/todoid
app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((Todo) => {
    if(!Todo) {
      res.status(404).send();
    }
    res.send({Todo}); //sends a response object that has a todo parameter so we can add mroe stuff l8r
  }).catch((e) => res.status(400).send());
  //validate ID using ObjectId.isValid()
  // if not, res with 404 send back empty body

  //find by id
    //success
      // if todo - send it back
      // if no todo - send back 404 with empty body
    //error
      // send back 400 - send back empty body back.
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove({_id: id}).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send);
  // get the id

  // validate the id / not valid? return 404

  // remove todo
    //success
      // if no doc, send 404
      // if doc returned, send with 200
    //error
      // 400 with empty body
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
