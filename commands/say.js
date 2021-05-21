require("module-alias/register");
const chalk = require("chalk");
const { botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["say"],
	use: "say tekst",
	about: "Få botten til å si noe",
	category: "fun"
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { channel, client } = message;
	
	message.delete();

	if (!args.length) return channel.send("🤐");
	channel.send(args.join(" "));

    botLog(client.user.id, chalk `{grey Used} SAY`);
}
