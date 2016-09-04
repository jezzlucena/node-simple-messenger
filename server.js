var express = require('express'),
    bodyParser = require('body-parser'),
    message = require('./routes/messages');

var app = express();

app.use(bodyParser.json());

app.get('/messenger', message.findAll);
app.post('/messenger', message.addMessage);
app.use(express.static(__dirname + '/views'));

app.listen(3000);
console.log('Listening on port 3000...');
