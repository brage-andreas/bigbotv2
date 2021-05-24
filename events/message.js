require("module-alias/register");
const chalk = require("chalk");
const { config, chatLog, botLog, getColours, emoji } = require("@auto");

// --------------------------------------------------------------

module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, mentions, content } = message;
    const { commands } = client;

    const { raveyardID, raveyardTimer } = await config("465490885417762827");
    const { yellow, red } = await getColours(client.user.id, true);

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


    const prefixStr = `**Prefix**: \`${prefix}\`\n\n\`${prefix}help\` for kommandoer`;
    const filter    = (msg) => msg.content.toUpperCase() === "JA" && msg.author.id === author.id;

    if (content === "prefix") {
        await channel.send("S-snakker du t-til meg? 😳 kanskje du vil skrive \"**ja**\" o-om det stemmer 👉👈");
        channel.awaitMessages(filter, { maxProcessed: 1, time: 20000, errors: ["maxProcessed", "time"] })
        .then( (c) => {
            if (c.size) channel.send(prefixStr);
            else channel.send("s-sory da");
        })
        .catch(() => channel.send("s-sory"));  
    }


	const args    = content.slice(prefix.length).trim().split(/\s+/g);
	const cmdname = args.shift().toLowerCase();


	if (!content.startsWith(prefix)) return;

	const command = commands.find(command => command.names.some(name => name === cmdname));

    if (command) {
        try { command.run(message, args); }
        catch (e) { console.log(chalk `{${red} ERROR WHEN RUNNING COMMAND:}\NName: ${command.names}/${cmdname}\n{${red} Error}:${e}`); }
    }

    else if (cmdname.replace(/\?+/g, "")) message.react(emoji(client, "questionmark"));
}
