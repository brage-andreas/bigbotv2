const chalk = require("chalk");
const { config, botLog, emoji } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["prune", "purge", "p"],
	use: "prune x <@user>",
	about: "Sletter x antall meldinger.",
	category: "management",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { client, channel } = message;
    const { admins } = await config("465490885417762827");

    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));
    if (args.length && !Number(args[0])) return message.react(emoji(client, "err"));

    const user = message.mentions.users?.first();

    let amount = Math.ceil(args[0]);
    if (amount <= 0  ) amount = 1;
    if (amount >= 100) amount = 99;

    await message.delete();
    channel.messages.fetch({ limit: amount }).then(messages => {
        if (user) messages = messages.filter(msg => msg.author.id === user.id);
        channel.bulkDelete(messages).catch(err => console.log(err.stack));
    });

    botLog(chalk `{grey Used} PRUNE {grey with amount set to} ${amount}`);
}
