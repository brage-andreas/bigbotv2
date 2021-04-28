module.exports = {
	name: ["help", "commands"],
	use: "help <kommando>",
	about: "Sender ei liste over alle kommandoer, eller info om en som er spesifisert",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { client, channel } = message;
	
	const getAllCmds = (commands) => commands.map((cmd, i) => `\`${i>10?"0"+i:i}\` ${cmd.name}`).join("\n");
	
	channel.send( getAllCmds(client.commands) );
}
