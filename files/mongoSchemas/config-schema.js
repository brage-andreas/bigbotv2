const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
    _id: String,
    admins: Array,
    embedURL: String,
    yellow: String,
    green: String,
    red: String,
    activity: String,
    activitytype: String,
    channels: Array,
    roles: Array,
    raveyardID: String,
    raveyardTimer: Number
}, {collection: "config"});

module.exports = mongoose.model("config", configSchema);
