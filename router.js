const express = require("express");
const { Router } = express;

const Message = require("./model");
// route for clients to copnnect on
// factory function - inside it you create smth and then you return it
// a factory for the router

function factory(stream) {
  const router = new Router();

  async function onStream(req, res) {
    const messages = await Message.findAll();
    const data = JSON.stringify(messages);
    // what data the clients receive when they connect to the stream
    // data needs to be serialized - string before sending it to the fclient
    stream.updateInit(data);
    // add the client that sent the req to the stream
    return stream.init(req, res);
  }

  async function onMessage(req, res) {
    const { text } = req.body;
    // messages.push(text);
    const message = await Message.create({ text });

    const messages = await Message.findAll();
    const data = JSON.stringify(messages);
    // send data to all clients
    stream.send(data);
    // always return res.send()
    return res.send(text);
  }
  router.get("/stream", onStream);
  router.post("/message", onMessage);

  return router;
}
module.exports = factory;
