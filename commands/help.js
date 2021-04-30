const chalk            = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, botLog }       = require("../files/auto.js");

module.exports = {
	name: ["help", "commands"],
	use: "help <kommando>",
	about: "Sender ei liste over alle kommandoer, eller info om en som er spesifisert",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { client, channel, member, author, guild } = message;

// --------------------------------------------------------------
	
	const getAllCmds = (commands) => commands.array().map((cmd, i) => `\`${i+1<10?"0"+(i+1):(i+1)}\` ${cmd.name}`).join("\n");
	
	if (!args.length) channel.send( getAllCmds(client.commands) );
    
	else {
        const { embedURL, embedColourYellow } = await config("465490885417762827");
		const command = client.commands.filter(cmd => cmd.name.some(name => name === args[0])).first();

		if (!command) return channel.send("eek");

		const helpEmbed = new MessageEmbed()
		.setColor(embedColourYellow)
		.setTitle(command.name.join(", "))
		.setURL(embedURL)
		.setAuthor(member.displayName, author.displayAvatarURL())
		.addField(`Hvordan`, `\`?${command.use}\` <valgfritt>, enten|eller`)
		.addField(`Hva`, command.about)
		.setTimestamp();
        
		channel.send(helpEmbed);
	}

    botLog(chalk `{grey Used} HELP`);
}
