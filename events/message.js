require("module-alias/register");
const chalk = require("chalk");
const { config, chatLog, botLog, getColours, emoji } = require("@auto");

// --------------------------------------------------------------

module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, content } = message;
    const { commands } = client;

    const { raveyardID, raveyardTimer } = await config("465490885417762827");
    const { yellow } = await getColours(client.user.id, true);

	const prefix = "?"; // TODO: add dynamic, per-server prefix with mongo


	if (channel.type === "DM" || author.id === client.user.id) return;
	if (message.type === "PINS_ADD") return message.delete();


    chatLog(message);

    
    if (channel.id === raveyardID) {
        setTimeout(() => {
            message.delete()
            .then((msg) => botLog(chalk `{grey Deleted a message in} {${yellow} #${msg.channel.name}} {grey after} ${(raveyardTimer/1000).toFixed(0)}s`))
            .catch(() => null)
        }, raveyardTimer);
    }


    if (author.bot) return;

    if (content === "prefix") return message.channel.send(`**Prefix**: \`${prefix}\`\n\n\`${prefix}help\` for kommandoer`);


	const args    = content.slice(prefix.length).trim().split(/\s+/g);
	const cmdname = args.shift().toLowerCase();


	if (!content.startsWith(prefix)) return;

	const command = commands.find(command => command.names.some(name => name === cmdname));

    if (command) command.run(message, args);
    else if (cmdname.replace(/\?+/g, "")) message.react(emoji(client, "questionmark"));
}
