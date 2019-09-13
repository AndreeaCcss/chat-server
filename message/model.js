const Sequelize = require("sequelize");

const db = require("../db");

const Message = db.define("message", {
  text: Sequelize.STRING
});

module.exports = Message;
