const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); // get seed data

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  });
});

describe('GET /todos route', () =>{
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.Todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo is not found', (done) => {
    //make sure you get a 404 back
    var badId = new ObjectId();
    request(app)
      .get(`/todos/${badId.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non object ids', (done) => {

    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
    // /todos/123. valid url, but not object
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexId).then((todos) => {
          expect(todos).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo id is invalid', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/abc123`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second todo item, set completed to false, 200, response body is same
    // completed is false
    // completedAt is null .toNotExist
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completedAt: null,
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done)
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString()); // id of body should be id of user supplied
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => { // must use bracket because of dash
        expect(res.headers['x-auth']).toExist(); // expect x-auth header to be present
        expect(res.body._id).toExist(); // expect a user Id to be returned
        expect(res.body.email).toBe(email); // expect email to be returned
      })
      .end((err) => {
        if (err) {
          return (done(err));
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist(); // expect user to be found in db
          expect(user.password).toNotBe(password); // expect hashed password toNotBe unhashed pw
          done();
        }).catch((e) => done(e)); // get error message
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var badEmail = 'jetsneakers.co';
    var password = 'abc123!';

    request(app)
      .post('/users')
      .send({badEmail, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var duplicateEmail = users[0].email;
    var password = 'abc123!';

    request(app)
      .post('/users')
      .send({duplicateEmail, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    // make the request
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200) // expect it to work, and then
    .expect((res) => { // expect an x-auth header to exist.
      expect(res.headers['x-auth']).toExist();
    }).end((err, res) => { // if both above check out, then end the request, and do something with the response

      // always start by handling an error
      if (err) {
        return done(err);
      }

      // then with the response, do a db lookup to compare
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth'] // expect token from db lookup to include the token from response
        });
        done();
      }).catch((e) => done(e)); // get error messages from db lookup or comparison

    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'badPassword'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));

    });
  });
});
