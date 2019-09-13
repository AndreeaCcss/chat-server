const express = require("express");
// allows you to create a stream - an array of clients
// then you can send a message to the stream and the message will be sent to all the clients
const Sse = require("json-sse");
const cors = require("cors");
const bodyParser = require("body-parser");

const messageFactory = require("./message/router");
const channelFactory = require("./channel/router");

const Message = require("./message/model");
const Channel = require("./channel/model");
const JSONparser = bodyParser.json();
// quality by value - it makes a new copy when you would export it
// it would be a different stream if you export it
// we need to use the same stream - the messageFactory allows that
const stream = new Sse();
const app = express();
const middleware = cors();
app.use(middleware);

const port = process.env.PORT || 4000;

app.use(JSONparser);

async function serialize() {
  const channels = await Channel.findAll({ include: [Message] });
  const data = JSON.stringify(channels);
  return data;
}
async function update() {
  const data = await serialize();
  stream.send(data);
}

async function onStream(req, res) {
  // const messages = await Message.findAll();
  const data = await serialize();
  // what data the clients receive when they connect to the stream
  // data needs to be serialized - string before sending it to the fclient
  stream.updateInit(data);
  // add the client that sent the req to the stream
  return stream.init(req, res);
}

app.get("/stream", onStream);

const messageRouter = messageFactory(update);
app.use(messageRouter);

const channelRouter = channelFactory(update);
app.use(channelRouter);

function onListen() {
  console.log(`Listening on ${port}`);
}

app.listen(port, onListen);
