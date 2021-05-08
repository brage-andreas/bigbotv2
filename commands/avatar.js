const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, getColours, emoji, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["avatar", "av", "profilepic", "pfp"],
	use: "avatar <@user|userID|(server|guild|s)>",
	about: "send dinna bildin",
	category: "info"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const imgOptions = { format: "png", dynamic: true, size: 1024 };
    const { mentions, channel, guild, author, client } = message;
    const { embedURL } = await config(client.user.id);
    const { yellow } = await getColours(client.user.id);

    const serverQuery = ["server", "guild", "s"].some(e => e === args[0]?.toLowerCase());

    const member = mentions.members.first() || guild.members.cache.get(args[0]);

    const subject = serverQuery ? "g" : member ? "m" : null;
    if (!subject && args.length) return message.react(emoji(client, "err"));

    const name   = subject === "g" ? guild.name : subject === "m" ? member.displayName : author.tag;
    const avatar = subject === "g" ? guild.iconURL(imgOptions) : subject === "m" ? member.user.displayAvatarURL(imgOptions) : author.displayAvatarURL(imgOptions);

    const avatarEmbed = new MessageEmbed()
    .setURL(embedURL)
    .setColor(yellow)
    .setDescription(`[Full Resolution](${avatar})`)
    .setTimestamp()
    .setTitle(name)
    .setImage(avatar);

    channel.send(avatarEmbed);


    const logName  = subject === "g" ? name      : subject === "m" ? member.user.tag : author.tag;
    const logID    = subject === "g" ? guild.id  : subject === "m" ? member.user.id  : author.id;
    const logGuild = subject === "g" ? " GUILD:" : ""
    botLog(client.user.id, chalk `{grey Used} AVATAR {grey on${logGuild}} ${logName} {grey (${logID})}`);
}
