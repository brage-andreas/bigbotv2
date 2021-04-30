const { MessageEmbed } = require("discord.js");
const { config, colours, emoji } = require("../files/auto.js");

module.exports = {
	name: ["members", "user"],
	use: "members @role|roleID",
	about: "Sender alle i en spesifisert rolle",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { mentions, guild, client, channel } = message;
    const { embedURL } = await config("465490885417762827");
    const { yellow } = colours;

    const role = mentions.roles.size ? mentions.roles.first() : guild.roles.cache.get(args[0]);
    if (!role) return message.react(emoji(client, "err"));

    const members = role.members
    .sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
    .array().map((member, i) => `\`${i+1<10?"0"+(i+1):i+1}\` <@${member.id}> (${member.user.tag})`).join("\n");

    const membersEmbed = new MessageEmbed()
    .setColor(yellow)
    .setTitle(role.name)
    .setURL(embedURL)
    .addField(`${role.members.size} stykkji`, members)
    .setTimestamp();

    channel.send(membersEmbed);
}
