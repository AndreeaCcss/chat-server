const express = require("express");
const { Router } = express;

const Message = require("./model");
// route for clients to connect on
// factory function - inside it you create smth and then you return it
// a factory for the router

function factory(update) {
  const router = new Router();

  async function onMessage(req, res) {
    const { text, channelId } = req.body;
    const message = await Message.create({ text, channelId });
    await update();
    return res.send(message);
  }
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
