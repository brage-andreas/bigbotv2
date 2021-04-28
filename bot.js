const Discord = require("discord.js");
const fs      = require("fs");


// --------------------------------------------------------------


const { token } = require("./files/settings.json");
const client = new Discord.Client({
	ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'] }
});

client.commands = new Discord.Collection();


// --------------------------------------------------------------


console.clear();
// console.log(logo);


// --------------------------------------------------------------


const getJsFiles = async (dir) => {
	const files = fs.readdirSync(dir)

    return files.filter(file => file.endsWith(".js")); 
}


// -- Commands --------------------------------------------------


getJsFiles("./commands/").then(commandFiles => {
	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	});
});


// -- Events ----------------------------------------------------


getJsFiles("./events/").then(eventFiles => {
	eventFiles.forEach(file => {
		const event = require(`./events/${file}`);
		if (event) client.on(event.name, (...args) => event.run(client, ...args));
	});
});


// -- Login ------------------------------------------------------


client.login(token);
