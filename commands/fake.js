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
    const { admins } = await config("465490885417762827");

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const guildMemberAdd    = require("../events/guildMemberAdd.js");
    const guildMemberRemove = require("../events/guildMemberRemove.js");

    if (args[0] === "join" ) return guildMemberAdd   .run(message.member);
    if (args[0] === "leave") return guildMemberRemove.run(message.member);
    
    message.react(emoji(client, "err"));
}
