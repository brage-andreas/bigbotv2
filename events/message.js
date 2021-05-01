const { Collection } = require("discord.js");
const { chatLog, emoji } = require("../files/auto.js");

module.exports = { name: "message" }

// --------------------------------------------------------------

module.exports.run = async (client, message) => {
	const { channel, author, content, guild } = message;
    const { commands, cooldowns } = client;
	const prefix = "?";

	if (message.type === "PINS_ADD") return message.delete();
	if (channel.tupe === "DM")       return;
	if (author.bot)                  return;

    chatLog(message);

	const args = content.slice(prefix.length).trim().split(/\s+/g);
	const commandname = args.shift().toLowerCase();

	if (!content.startsWith(prefix)) return;

	const command = commands.find(command => command.name.some(name => name === commandname));

    if (command) {
        if (!cooldowns.get(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const lastUse = cooldowns.get(command.name);
        const cooldown = (command.cooldown ?? 2) * 1000;
        
        if (lastUse.has(`${guild.id}-${channel.id}`)) {
            const freed = lastUse.get(`${guild.id}-${channel.id}`)+cooldown;
    
            if (now < freed) return message.react(emoji(client, "time"))
        }
        
        lastUse.set(`${guild.id}-${channel.id}`, now);
        setTimeout(() => lastUse.delete(`${guild.id}-${channel.id}`), cooldown);
    
        command.run(message, args);
    } else {
        message.react(emoji(client, "questionmark"));
    }
}
