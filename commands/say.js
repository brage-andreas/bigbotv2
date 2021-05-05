const chalk = require("chalk");
const { botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["say"],
	use: "say tekst",
	about: "Få botten til å si noe",
	category: "fun"
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { channel } = message;
	
	message.delete();

	if (!args.length) return channel.send("🤐");
	channel.send(args.join(" "));

    botLog(chalk `{grey Used} SAY`);
}
