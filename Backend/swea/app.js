const express = require('express');
const body_parser = require('body-parser');
const corspolicy = require('cors');

const app = express();

// Using components
app.use(body_parser.json());
app.use(corspolicy());

// Making routes available
const Routes = require("./routes/Routes");
app.use('', Routes);

// App listening on port 8080
const port = process.env.PORT || 8080
app.listen(port);

console.log('Server started');