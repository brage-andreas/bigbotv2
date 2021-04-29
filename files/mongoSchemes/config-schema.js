const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
    _id: String,
    admins: String,
    embedURL: String,
    embedColourYellow: String,
    embedColourGreen: String,
    embedColourRed: String,
    activity: String,
    activitytype: String,
    channels: Array,
    roles: Array,
    raveyardID: String,
    raveyardTimer: Number
}, {collection: "config"});

module.exports = mongoose.model("config", configSchema);
