const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { colours, config, botLog, parseCreatedJoinedAt } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = { name: "guildMemberRemove" }

// --------------------------------------------------------------

module.exports.run = async (member) => {

    const { red } = colours;
    const { user, guild } = member;
	const { embedURL, channels, roles } = await config("465490885417762827");
    const [ made, came ] = parseCreatedJoinedAt(user.createdAt, member.joinedAt);
	
    const allChannels = guild.channels.cache.filter(ch => ch.type === "text");

    const channel = channels.forEach(channelName => allChannels.find(ch => ch.name === channelName)) || allChannels.first();
	
	const joinEmbed = new MessageEmbed()
	.setColor(red)
	.setTitle("ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ HJØLP HAN DRO")
	.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
	.setURL(embedURL)
	.setDescription(`hadebra ${member}`)
	.addField("Info", `• Laget: ${made}\n\n• Kom: ${came}`)
	.setTimestamp();

	channel.send(joinEmbed).catch(console.error);

    botLog(chalk `${user.tag} {grey (${user.id})} {hex("${red}") left}`, guild.name);
}
