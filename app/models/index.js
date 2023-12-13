const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.events = require("./event.model.js")(mongoose);
db.renters = require("./renter.model.js")(mongoose);
db.users = require("./user.model.js")(mongoose);
db.orders = require("./order.model.js")(mongoose);
db.service = require("./service.model.js")(mongoose);

module.exports = db;
