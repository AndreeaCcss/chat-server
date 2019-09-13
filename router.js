const express = require("express");
const { Router } = express;

// route for clients to copnnect on
// factory function - inside it you create smth and then you return it
// a factory for the router
const messages = ["Hello World", "Goodbye"];

function factory(stream) {
  const router = new Router();

  function onStream(req, res) {
    const data = JSON.stringify(messages);
    // what data the clients receive when they connect to the stream
    // data needs to be serialized - string before sending it to the fclient
    stream.updateInit(data);
    // console.log("data:", data);
    // add the client that sent the req to the stream
    return stream.init(req, res);
  }

  function onMessage(req, res) {
    const { text } = req.body;
    messages.push(text);
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