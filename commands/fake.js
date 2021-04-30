const { config, emoji } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
    name: ["fake"],
	use: "fake join|leave",
	about: "fake",
	category: "management",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client } = message;
    const { admins } = await config("465490885417762827");

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const guildMemberAdd    = require("../events/guildMemberAdd.js");
    const guildMemberRemove = require("../events/guildMemberRemove.js");

    if (args[0] === "join" ) guildMemberAdd   .run(message.member);
    if (args[0] === "leave") guildMemberRemove.run(message.member);
    else message.react(client, "err");
}
