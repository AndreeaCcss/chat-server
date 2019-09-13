const express = require("express");
const { Router } = express;

const Channel = require("./model");

function factory(update) {
  const router = new Router();

  async function onChannel(req, res) {
    const { name } = req.body;
    const channel = await Channel.create({ name });
    await update();

    return res.send(channel);
  }
  router.post("/channel", onChannel);

  return router;
}
module.exports = factory;
