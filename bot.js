const Discord = require("discord.js");
const chalk   = require("chalk");
const fs      = require("fs");

// --------------------------------------------------------------

const { token, logo, logprefix } = require("./files/settings.json");
const client = new Discord.Client({
	ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'] }
});

client.commands = new Discord.Collection();
client.events   = new Discord.Collection();

// --------------------------------------------------------------

console.clear();
console.log(logo);

// --------------------------------------------------------------

const getJsFiles = async (dir) => {
	await fs.readdir(dir, (error, files) => {
		if (error) console.error(error);

		return files.filter(file => file.endsWith(".js"));
	});
}

// -- Commands --------------------------------------------------

getJsFiles("./commands/").then(commandFiles => {
	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	});
}

// -- Events ----------------------------------------------------

getJsFiles("./events/").then(eventFiles => {
	eventFiles.forEach(file => {
		const event = require(`./commands/${file}`);
		client.events.set(event.name, event);
	});
}

// -- Login ------------------------------------------------------

client.login(token);
