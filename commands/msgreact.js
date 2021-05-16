require("module-alias/register");
const chalk = require("chalk");
const { emoji, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	name: ["react", "r"],
	use: "react <messageID> emojis",
	about: "Reagerer til en melding. Støtter alle emojier innebygd i Discord, pluss \"adm\", \"err\", \"questionmark\", \"time\" og \"check\"",
	category: "fun"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { reference, channel, id, client } = message;

    message.delete();
    const targetID = reference?.messageID || (/\d{17,21}/.test(args[0]) ? args.shift()?.replace(/\D+/g, "") : null);
    let target     = (targetID ? channel.messages.cache.get(targetID) : 0) || (targetID ? await channel.messages.fetch(targetID) : null) || await channel.messages.fetch({ before: id, limit: 1 });

    if (!target) return message.react(emoji(client, "err"));
    if (target.size) target = target.first();
    
    if (!args.length) return message.react(emoji(client, "err"));
    emojis = args.map(arg => ["adm", "err", "time", "check", "questionmark"].some(e => e === arg) ? emoji(client, arg) : arg);

    let counter = 0;
    emojis.forEach(emoji => {
        target.react(emoji).catch(() => null);
        counter++
    });

    botLog(client.user.id, chalk `{grey Used} REACT {grey on a message from} ${target.author.tag} {grey with} ${counter} {grey emojies}`);
}
