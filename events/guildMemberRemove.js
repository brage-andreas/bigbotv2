module.exports = { name: "guildMemberRemove" }

// --------------------------------------------------------------

module.exports.run = async (member) => {
	const { guild, user } = member;
	const embedColourRed = null, embedURL = null;

// --------------------------------------------------------------

	const channel = guild.channels.cache.find(ch => c === ch.name) || guild.channels.cache.filter(ch => ch.type === "text").first();

// --------------------------------------------------------------

	const joinEmbed = new Discord.MessageEmbed()
	.setColor(embedColourRed)
	.setTitle("ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ HJØLP HAN DRO")
	.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
	.setURL(embedURL)
	.setDescription(`hadebra ${member}`)
	.addField("Info", `• Laget: made\n\n• Kom: came`)
	.setTimestamp();
    
	channel.send(joinEmbed).catch(console.error);
}
