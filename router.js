const express = require("express");
const { Router } = express;

const Message = require("./model");
// route for clients to copnnect on
// factory function - inside it you create smth and then you return it
// a factory for the router

function factory(stream) {
  const router = new Router();

  async function update() {
    const messages = await Message.findAll();
    const data = JSON.stringify(messages);
    stream.send(data);
  }

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
    const message = await Message.create({ text });
    await update();
    // always return the res.send()
    return res.send(text);
  }
  router.get("/stream", onStream);
  router.post("/message", onMessage);

  async function onDelete(req, res) {
    const destroyed = await Message.destroy({ where: {}, truncate: true });
    await update();
    return res.send({ destroyed });
  }
  router.delete("/message", onDelete);

  return router;
}
module.exports = factory;
