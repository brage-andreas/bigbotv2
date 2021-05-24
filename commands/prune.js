require("module-alias/register");
const chalk = require("chalk");
const { config, botLog, emoji } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["prune", "purge", "p"],
	use: "prune x <@user|userID> <@channel|channelID>",
	about: "Sletter x antall meldinger.",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { client, guild, channel } = message;
    const { admins } = await config("465490885417762827");

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));
    if (args.length && !Number(args[0])) return message.react(emoji(client, "err"));

    const user = message.mentions.users?.first() || guild.members.cache.get(args[1])?.user;
    if (!user && args[1]) return message.react(emoji(client, "err"));

    const amount = Math.ceil(args[0]) >= 100 ? 99 : Math.ceil(args[0]) <= 0 ? 1 : Math.ceil(args[0]);

    await message.delete();
    channel.messages.fetch({ limit: amount }).then(messages => {
        if (user) messages = messages.filter(msg => msg.author.id === user.id);
        channel.bulkDelete(messages, true)
        .then(msgs => {
            if (user) botLog(client.user.id, chalk `{grey Used} PRUNE {grey on} ${msgs.size} {grey messages limited to} ${user.tag} {grey (${user.id})}`);
            else      botLog(client.user.id, chalk `{grey Used} PRUNE {grey on} ${msgs.size} {grey messages}`);
        })
        .catch(err => console.log(err.stack));
    });
}
