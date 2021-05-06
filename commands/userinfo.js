const chalk = require("chalk");
const { getColours, emoji, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["userinfo", "memberinfo"],
	use: "userinfo @user|userID",
	about: "Sender diverse informasjon om en bruker.",
	category: "management|fun|info|support"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { client, mentions, guild } = message;
    const { embedURL } = await getColours(client.user.id);

    if (!args.length) return message.react(emoji(client, "err"));

    const member = mentions.members.first() || guild.members.cache.get(args[0]);
    const user   = member?.user;

    if (!member) return message.react(emoji(client, "err"));

    botLog(client.user.id, chalk `{grey Used} USERINFO {grey on} ${user.tag} {grey ${user.id}}`);
}
