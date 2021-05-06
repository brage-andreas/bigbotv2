const { config, emoji } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
    name: ["fake"],
	use: "fake join|leave",
	about: "fake",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client } = message;
    const { admins } = await config(client.user.id);

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const memberAdd    = require("../events/guildMemberAdd.js");
    const memberRemove = require("../events/guildMemberRemove.js");

    if (args[0] === "join" ) return memberAdd   .run(message.member);
    if (args[0] === "leave") return memberRemove.run(message.member);
    
    message.react(emoji(client, "err"));
}
