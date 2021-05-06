const chalk = require("chalk");
const { config, chatLog, botLog, getColours, emoji } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, content } = message;
    const { commands } = client;

    const { raveyardID, raveyardTimer } = await config("465490885417762827");
    const { yellow } = await getColours(client.user.id, true);

	const prefix = "?";


	if (channel.type === "DM" || author.id === client.user.id) return;
	if (message.type === "PINS_ADD") return message.delete();


    chatLog(message);

    
    if (channel.id === raveyardID) {
        setTimeout(() => {
            try { message.delete(); }
            finally { botLog(chalk `{grey Deleted a message in} {${yellow} #${message.channel.name}} {grey after} ${(raveyardTimer/1000).toFixed(0)}s`); }
        }, raveyardTimer);
    }


    if (author.bot) return;


	const args = content.slice(prefix.length).trim().split(/\s+/g);
	const commandname = args.shift().toLowerCase();


	if (!content.startsWith(prefix)) return;

	const command = commands.find(command => command.name.some(name => name === commandname));

    if (command) command.run(message, args);
    else if (commandname.replace(/\?+/g, "")) message.react(emoji(client, "questionmark"));
}
