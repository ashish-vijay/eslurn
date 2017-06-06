    var express  = require('express');
    var app = express();
    var mongoose = require('mongoose');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var moment = require('moment');

    mongoose.Promise = global.Promise;

   var mongoURL = process.env.PROD_MONGODB || 'mongodb://localhost:27017/todo-eslurn';
    mongoose.connect(mongoURL);
    var Todoschema =  new mongoose.Schema({
          text: {
            type: String
          },
          time: {
            type: String
          }
      });

    var Chartschema = new mongoose.Schema({
        ctodo: {
          type: Number
        },
        ttodo: {
          type: Number
        }
    });

    var Todo = mongoose.model('Todo',  Todoschema);
    var Chart = mongoose.model('Chart', Chartschema);

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());


    var port = process.env.PORT || 5000;

      app.get('/api/chartt', function(req, res) {
        Chart.findOne().sort({ttodo:-1}).then(function(err, values) {
          if(err)
            res.send(err);
          res.json(values);
        }).catch((e) => {
              console.log('Error in /FIND api/chartt' + e);
            });
      });

      app.get('/api/chartc', function(req, res) {
        Chart.findOne().sort({ctodo:-1}).then(function(err, values) {
          if(err)
            res.send(err);
          res.json(values);
        }).catch((e) => {
              console.log('Error in /FIND api/chartc' + e);
            });
      });

      app.post('/api/chart', function(req, res) {
        Chart.create({
          ttodo: req.body.ttodo,
          ctodo: req.body.ctodo
        }, function(err, value) {
          if(err)
            res.send(err);
          Chart.find(function(err, values) {
            if(err)
              res.send(err);
            res.json(values);
          });
        });
      });

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
