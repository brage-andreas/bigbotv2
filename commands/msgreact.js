require("module-alias/register");
const chalk = require("chalk");
const { emoji, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["react", "r"],
	use: "react <messageID> emojis",
	about: "Reagerer til en melding. Støtter alle emojier innebygd i Discord, pluss \"adm\", \"err\", \"questionmark\", \"time\" og \"check\"",
	category: "fun"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const botEmojisArray = Object.keys(emoji(null, "fullTable"));
    const { reference, channel, id, client } = message;

    if (!args.length) return message.react(emoji(client, "err"));

    const getMessageID = () => {
        const regexForIDs = /\d{17,21}/;
        let id = null;

        if (reference) {
            id = reference.messageID;
        }

        if (!id && regexForIDs.test(args[0])) {
            id = args.shift()?.replace(/\D+/g, "");
        }

        return id;
    }

    const getTarget = async () => {
        const targetMsgID = getMessageID(reference);
        let target;

        if (targetMsgID) {
            target = channel.messages.cache.get(targetMsgID);
        }
        
        if (targetMsgID && !target) {
            target = await channel.messages.fetch(targetMsgID);
        }

        if (!target) {
            target = await channel.messages.fetch({ before: id, limit: 1 });
        }

        if (!target)     return message.react(emoji(client, "err"));
        if (target.size) target = target.first();

        return target;
    }

    message.delete();

    const target = await getTarget();
    const emojis = args.map(arg => botEmojisArray.some(emojiName => emojiName === arg) ? emoji(client, arg) : arg);

    let counter = 0;
    emojis.forEach(emoji => {
        target.react(emoji)
        .then (() => counter++)
        .catch(() => null);
    });

    botLog(client.user.id, chalk `{grey Used} REACT {grey on a message from} ${target.author.tag} {grey with} ${counter} {grey emojies}`);
}
