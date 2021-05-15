const mongoose = require("mongoose");

const nickSchema = mongoose.Schema({
    _id: String,
    names: Array
});

module.exports = mongoose.model("nicknames", nickSchema);
