const chalk = require("chalk");
const { botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["activities", "acts"],
	use: "",
	about: "",
	category: "management|fun|info|support",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	
    botLog(chalk `{grey Used} X`);
}
