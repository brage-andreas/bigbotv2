module.exports = { name: "guildMemberAdd" }

// --------------------------------------------------------------

module.exports.run = async (member) => {

	const { guild, user } = member;
	const { channels, roles, embedColourGreen, embedURL } = null;

// --------------------------------------------------------------
	
	const allChannels = guild.channels.cache.filter(ch => ch.type === "text").sort((a, b) => b.position - a.position);

	let channel = allChannels.find(ch => ch.name === "watermusk");
	if (!channel) channel = allChannels.first();

	const role = guild.roles.cache.find(ro => ro.name === "gonny gonzalez");

// --------------------------------------------------------------
	
	const joinEmbed = new Discord.MessageEmbed()
	.setColor(embedColourGreen)
	.setTitle("HEISANNHEISANNHEISANN")
	.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
	.setURL(embedURL)
	.setDescription(`vekomen ${member}`)
	.addField("Info", `• Laget: made\n\n• Kom: came`)
	.setTimestamp();

// --------------------------------------------------------------

	channel.send(joinEmbed).catch(console.error);
	if (role) member.roles.add(role).catch(console.error);
}
