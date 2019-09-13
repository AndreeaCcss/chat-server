const express = require("express");
// allows you to create a stream - an array of clients
// then you can send a message to the stream and the message will be sent to all the clients
const Sse = require("json-sse");
const factory = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");

const JSONparser = bodyParser.json();
// quality by value - it makes a new copy when you would export it
// it would be a different stream if you export it
// we need to use the same stream - the factory allows that
const stream = new Sse();
const app = express();
const middleware = cors();
app.use(middleware);

const port = process.env.PORT || 4000;

app.use(JSONparser);

const router = factory(stream);
app.use(router);

function onListen() {
  console.log(`Listening on ${port}`);
}

app.listen(port, onListen);
