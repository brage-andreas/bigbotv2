const { emoji } = require("../files/auto.js");

module.exports = {
	name: ["members", "user"],
	use: "members @role|roleID",
	about: "Sender alle i en spesifisert rolle",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { mentions, guild, client, channel } = message;

    const role = mentions.roles.size ? mentions.roles.first() : guild.channels.cache.get(args[0]);
    if (!role) return message.react(emoji(client, "err"));

    const members = role.members.map(member => `<@${member.id}> (${member.user.tag})`).join("\n");

    channel.send(`${members.length} stykkji\n${members}`);
}
