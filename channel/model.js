const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("../message/model");

const Channel = db.define("channel", {
  name: Sequelize.STRING
});

Channel.hasMany(Message);
Message.belongsTo(Channel);

module.exports = Channel;
