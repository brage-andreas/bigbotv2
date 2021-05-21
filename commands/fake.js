require("module-alias/register");
const { config, emoji } = require("@auto");

// --------------------------------------------------------------

module.exports = {
    names: ["fake"],
	use: "fake join|leave",
	about: "fake",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client, member } = message;
    const { admins } = await config(client.user.id);

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const memberAdd    = require("../events/guildMemberAdd.js");
    const memberRemove = require("../events/guildMemberRemove.js");

    if (args[0] === "join" ) return memberAdd   .run(member);
    if (args[0] === "leave") return memberRemove.run(member);
    
    message.react(emoji(client, "err"));
}
