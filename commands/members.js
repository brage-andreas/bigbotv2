require("module-alias/register");
const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, emoji, botLog, getColours } = require("@auto");

module.exports = {
	names: ["members", "users"],
	use: "members @role|roleID",
	about: "Sender alle i en spesifisert rolle",
	category: "info"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { mentions, guild, client, channel } = message;
    const { embedURL } = await config("465490885417762827");
    const { yellow } = await getColours(client.user.id);

    const role = mentions.roles.first() || guild.roles.cache.get(args[0]);
    if (!role) return message.react(emoji(client, "err"));

    const members = role.members
    .sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)
    .array()
    .map((member, i) => `\`${i+1<10?"0"+(i+1):i+1}\` <@${member.id}> (${member.user.tag})`)
    .join("\n");

    const membersEmbed = new MessageEmbed()
    .setColor(yellow)
    .setTitle(role.name)
    .setURL(embedURL)
    .addField(`${role.members.size} stykkji`, members)
    .setTimestamp();

    channel.send(membersEmbed);

    botLog(chalk `{grey Used} MEMBERS {grey on role} ${role} {grey (${role.id})}`);
}
