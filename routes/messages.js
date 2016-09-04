var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('simple-messenger-db', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'simple-messenger-db' database");
        db.collection('messages', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'messages' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('messages', function(err, collection) {
        collection.find().sort({created_on: 1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addMessage = function(req, res) {
    var message = req.body;
    console.log('Adding message: ' + JSON.stringify(message));
    db.collection('messages', function(err, collection) {
        message.created_on = new Date();
        collection.insert(message, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
  var messages = [
    {
      user_name: "System",
      created_on: new Date(),
      content: "Welcome to our simple messenger. There is no moderation, so watch out for yourselves.",
    }
  ];

  db.collection('messages', function(err, collection) {
      collection.insert(messages, {safe:true}, function(err, result) {});
  });
};
