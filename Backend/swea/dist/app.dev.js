"use strict";

var express = require('express');

var body_parser = require('body-parser');

var corspolicy = require('cors');

var app = express(); // Importing custom routes

var accessRoute = require('./routes/auth');

var cardsRoute = require('./routes/cards');

var senderRoute = require('./routes/esender'); // Using components


app.use(body_parser.json());
app.use(corspolicy()); // Making routes available

app.use('/access', accessRoute); // ADDRESS:PORT/

app.use('/tasks', cardsRoute); // ADDRESS:PORT/

app.use('/msg', senderRoute); // ADDRESS:PORT/
// App listening on port 8080

var port = process.env.PORT || 8080;
app.listen(port);