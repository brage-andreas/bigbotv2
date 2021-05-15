const chalk = require("chalk");
const { botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["new"],
	use: "new x",
	about: "lag ny XD",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client } = message;

    // new channel -name banan -parent @/id
    if (type === "CHANNEL") {
        const parentIndex = args.findIndex(e => e === "-parent" || e === "-p");
        const   nameIndex = args.findIndex(e => e === "-name"   || e === "-n");
    }

    botLog(client.user.id, chalk `{grey Used} NEW`);
}
