const { chatLog, emoji } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, content, guild } = message;
    const { commands } = client;
	const prefix = "?";

	if (message.type === "PINS_ADD") return message.delete();
	if (channel.tupe === "DM")       return;
	if (author.bot)                  return;

    chatLog(message);

	const args = content.slice(prefix.length).trim().split(/\s+/g);
	const commandname = args.shift().toLowerCase();

	if (!content.startsWith(prefix)) return;

	const command = commands.find(command => command.name.some(name => name === commandname));

    if (command) command.run(message, args);
    else if (commandname.replace(/\?+/g, "")) message.react(emoji(client, "questionmark"));
}
