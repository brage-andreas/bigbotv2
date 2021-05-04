const chalk = require("chalk");
const { emoji, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["activities", "acts"],
	use: "activities @user|userID",
	about: "Sender hva brukeren gjør",
	category: "info",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { mentions, guild, client, channel } = message;

    const member = mentions.members.first() || guild.members.cache.get(args[0]);
    if (!member) {
        message.react(emoji(client, "err"));
        channel.send("Finner ikke brukeren.");
        return;
    }

    const { presence, user }     = member;
    const { activities, status } = presence;

    botLog(chalk `{grey Used} ACTIVITIES {grey on} ${user.tag} {grey (${user.id})}`);
}
