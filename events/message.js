module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, content } = message;
	const prefix = "?";

// --------------------------------------------------------------

	if (message.type === "PINS_ADD") return message.delete();
	if (channel.tupe === "DM")       return;
	if (author.bot)                  return;

// --------------------------------------------------------------

	const args = content.slice(prefix.length).trim().split(/\s+/g);
	const commandname = args.shift().toLowerCase();

// --------------------------------------------------------------

	const command = client.commands.get(commandname);
	if (command) command.run(message, args);
}
