require("module-alias/register");
const chalk = require("chalk");
const { config, emoji, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	name: ["new"],
	use: "new channel[-name navn -parent parentID topic]",
	about: "lag ny XD",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { guild, client } = message;

    const { admins } = await config(client.user.id);
    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const type = args.shift();

    // new channel -name banan -parent @/id
    if (type.toUpperCase() === "CHANNEL" || type.toUpperCase() == "C") {
        const chParentIndex = args.findIndex(e => e === "-parent" || e === "-p");
        const   chNameIndex = args.findIndex(e => e === "-name"   || e === "-n");

        const chParentID = chParentIndex !== -1 ? args[chParentIndex+1] : null;
        let chName       = chNameIndex   !== -1 ? args[chNameIndex+1]   : "default";

        if (chParentIndex !== -1 && chNameIndex !== -1) {
            args.splice(chNameIndex > chParentIndex ? chNameIndex : chParentIndex, 2);
            args.splice(chNameIndex < chParentIndex ? chNameIndex : chParentIndex, 2);
        }
        else if (chParentIndex !== -1) args.splice(chParentIndex, 2); 
        else if (chNameIndex   !== -1) args.splice(chNameIndex,   2); 

        const chTopic = args.length ? args.join(" ") : null;

        let check = true, n = 0;
        while (check) {
            if (guild.channels.cache.filter(ch => ch.name === chName).size) chName += ++n;
            else check = false;
        }

        const chParent = guild.channels.cache.get(chParentID) || guild.channels.cache.find(ch => ch.name === chParentID); 

        guild.channels.create(chName, { parent: chParent, topic: chTopic }).catch(console.error);

        message.react(emoji(client, "check"));
        botLog(client.user.id, chalk `{grey Used} NEW {grey on channel. Name:} ${chName}${chParent ? ` {grey Parent:} ${chParent.name}` : ""}${chTopic ? ` {grey Topic:} ${chTopic}` : ""}`);
    }

    else return message.react(emoji(client, "err"));

}
