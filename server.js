    var express  = require('express');
    var app = express();
    var mongoose = require('mongoose');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var moment = require('moment');

   var mongoURL = process.env.PROD_MONGODB || 'mongodb://localhost:27017/todo-eslurn';
    mongoose.connect(mongoURL);
    var Todo = mongoose.model('Todo', {
          text: {
            type: String
          },
          time: {
            type: String
          }
      });
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());


    var port = process.env.PORT || 5000;

      app.get('/api/todos', function(req, res) {
        Todo.find(function(err, todos) {
              if (err)
                  res.send(err)
              res.json(todos);
          });
      });

      app.post('/api/todos', function(req, res) {
          Todo.create({
              text : req.body.text,
              done : false,
              time : req.body.time
          }, function(err, todo) {
              if (err)
                  res.send(err);
              Todo.find(function(err, todos) {
                  if (err)
                      res.send(err)
                  res.json(todos);
              });
          });
      });

      app.delete('/api/todos/:todo_id', function(req, res) {
          Todo.remove({
              _id : req.params.todo_id
          }, function(err, todo) {
              if (err)
                  res.send(err);
              Todo.find(function(err, todos) {
                  if (err)
                      res.send(err)
                  res.json(todos);
              });
          });
      });
    
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
