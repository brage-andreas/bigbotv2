require("module-alias/register");
const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, botLog, getColours, emoji } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["help", "h", "commands", "cmds"],
	use: "help <kommando|-all>",
	about: "Sender ei liste over alle kommandoer, eller info om en som er spesifisert",
	category: "support"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { guild, client, channel, member, author } = message;
    const { embedURL } = await config(client.user.id);
    const { yellow }   = await getColours(client.user.id);
    const prefix       = "?"

    const getI = (i) => i+1 <10 ? String("0"+(i+1)) : String(i+1); 
    const getName = (array) => {
        let aliases = array.slice(1, array.length);
        return aliases.length ? `${array[0]} (${aliases.join(", ")})` : `${array[0]}`;
    }

    const formatCmds = (commands)           => commands.array().map((cmd, i) => `\`${getI(i)}\` ${getName(cmd.name)}`).join("\n");
    const getCmds    = (commands, category) => commands.filter(command => command.category.toLowerCase() === category.toLowerCase());

    const all = args[0] === "-all";
    if (!args.length || all) {
        
        const cmds = {};

        if (all) {
            cmds.all  = formatCmds(client.commands)
        } else {
            cmds.man  = getCmds(client.commands, "management");
            cmds.fun  = getCmds(client.commands, "fun");
            cmds.info = getCmds(client.commands, "info");
            cmds.sup  = getCmds(client.commands, "support");
        }

        const commandsEmbed = new MessageEmbed()
        .setColor(yellow)
        .setTitle(`komanndoer i ${guild.name}`)
        .setURL(embedURL)
        .setTimestamp();

        if (all) {
            commandsEmbed.addField("yeah, dats rgith", cmds.all);
        } else {
            if (cmds.man.size)  commandsEmbed.addField("karen da #managre", formatCmds(cmds.man));
            if (cmds.fun.size)  commandsEmbed.addField("moro", formatCmds(cmds.fun));
            if (cmds.info.size) commandsEmbed.addField("ehh #stalker much ROFL", formatCmds(cmds.info));
            if (cmds.sup.size)  commandsEmbed.addField("jelp", formatCmds(cmds.sup));
        }

        if (!commandsEmbed.fields.length) return channel.send("Det er ingen oop~");
        commandsEmbed.addField("eekers poppern", `Prøv \`${prefix}help kommando\` for mer hjølp`);

        channel.send(commandsEmbed);
    }
	
    else {
		const command = client.commands.filter(cmd => cmd.name.some(name => name === args[0])).first();

		if (!command) {
            message.react(emoji(client, "err"));
            return channel.send(`Finner ikke kommandoen "${args[0]}" i ${guild.name}`);
        }

		const helpEmbed = new MessageEmbed()
		.setColor(yellow)
		.setTitle(getName(command.name))
		.setURL(embedURL)
		.setAuthor(member.displayName, author.displayAvatarURL())
		.addField(`Hvordan`, `\`${prefix}${command.use}\``)
		.addField(`Hva`, command.about)
		.setTimestamp();
        
		channel.send(helpEmbed);
	}

    botLog(client.user.id, chalk `{grey Used} HELP`);
}
