require("module-alias/register");
const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { config, getColours, emoji, parseCreatedJoinedAt, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["serverinfo", "si"],
	use: "serverinfo <serverID>",
	about: "sender masse ræl om en server",
	category: "management|fun|info|support"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    String.prototype.capitalise = function() { return this.charAt(0).toUpperCase() + this.slice(1); }

    const { client, channel } = message;
    const { embedURL } = await config(client.user.id);
    const { yellow } = await getColours(client.user.id);
    
    const guild = client.guilds.cache.get(args[0]) || message.guild;

    if (!guild || !guild.available) {
        message.react(emoji(client, "err"));
        channel.send("Får ikke tak i serveren. Sikker på at den ikke er nede?");
        return;
    }
    
    const { members, ownerID, createdAt, channels, name, description, id, region, memberCount, roles } = guild;
    const owner = members.cache.get(ownerID) || await members.fetch(ownerID);

    const made = parseCreatedJoinedAt(createdAt);
    
    const oldestChannel      = (chl) => chl.sort((a,b) => a.createdTimestamp-b.createdTimestamp).first();
    const textChannels       = channels.cache.filter(c => c.type === "text");
    const voiceChannels      = channels.cache.filter(c => c.type === "voice");
    const oldestTextChannel  = oldestChannel(textChannels);
    const oldestVoiceChannel = oldestChannel(voiceChannels);

    const oldTextString  = oldestTextChannel  ? `\nEldste tekstkanal er ${oldestTextChannel}.`       : ``;
    const oldVoiceString = oldestVoiceChannel ? `\nEldste voicekanal er ${oldestVoiceChannel.name}.` : ``;

    const infoEmbed = new MessageEmbed()
    .setColor(yellow)
    .setThumbnail(guild.iconURL({ format: "png", dynamic: true, size: 1024 }))
    .setTitle(name)
    .setURL(embedURL)
    .addField("Beskrivelse", description ? description : "Har ingen beskrivelse.")
    .addField("ID", `\`${id}\``, true)
    .addField("Ikon", `[Link](${guild.iconURL({ format: "png", dynamic: true, size: 4096 })})`, true)
    .addField("Server laget", made)
    .addField("Voice-region", region.capitalise(), true)
    .addField("Eier", owner, true)
    .addField("Medlemmer", `${memberCount}`)
    .addField("Kanaler", `${textChannels.size} text og ${voiceChannels.size} voice (${channels.cache.size} totalt)${oldTextString}${oldVoiceString}`)
    .addField("Roller", `${roles.cache.size-1} roller`)
    .setTimestamp();

    channel.send(infoEmbed);

    botLog(client.user.id, chalk `{grey Used} SERVERINFO {grey on} ${guild.name} {grey (${guild.id})}`);
}
