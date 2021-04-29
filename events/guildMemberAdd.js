const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, botLog, parseCreatedJoinedAt } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = { name: "guildMemberAdd" }

// --------------------------------------------------------------

module.exports.run = async (member) => {

    const { guild, user } = member;
	const { embedColourGreen, embedURL, channels, roles } = await config("465490885417762827");

// --------------------------------------------------------------
	
    const allChannels = guild.channels.cache.filter(ch => ch.type === "text");

    const channel = channels.forEach(channelName => allChannels      .find(ch => ch.name === channelName)) || allChannels.first();
	const role    = roles   .forEach(roleName    => guild.roles.cache.find(ro => ro.name === roleName   ));

// --------------------------------------------------------------
	
	const joinEmbed = new MessageEmbed()
	.setColor(embedColourGreen)
	.setTitle("HEISANNHEISANNHEISANN")
	.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
	.setURL(embedURL)
	.setDescription(`vekomen ${member}`)
	.addField("Info", `• Laget: made\n\n• Kom: came`)
	.setTimestamp();

// --------------------------------------------------------------

	channel.send(joinEmbed).catch(console.error);
	if (role) member.roles.add(role).catch(console.error);

// --------------------------------------------------------------

    botLog(chalk `${user.tag} {grey (${user.id})} {hex("${embedColourGreen}") joined}`, guild.name);
}
