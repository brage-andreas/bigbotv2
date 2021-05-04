const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { emoji, config, colours, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["activities", "activity", "acts", "status"],
	use: "activities @user|userID",
	about: "Sender hva brukeren gjør",
	category: "info",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { mentions, guild, member, client, channel } = message;
    const { embedURL } = await config("465490885417762827");
    const { yellow } = colours;

    let guildMember = mentions.members.first() || guild.members.cache.get(args[0]);
    if (!guildMember && !args.length) guildMember = member;

    if (!guildMember) return message.react(emoji(client, "err"));

    const { presence, user }     = guildMember;
    const { activities, status } = presence;
    const name = guildMember.displayName;

    const strStatus = status === "online" ? "🟩 Online"         :
                      status === "idle"   ? "🟨 Idle"           :
                      status === "dnd"    ? "🟥 Do Not Disturb" :
                      "⬛ Offline";

    const actEmbed = new MessageEmbed()
    .setTitle(!name.endsWith("s") && !name.endsWith("z") ? `${name}s aktiviteter` : `${name}' aktiviteter`)
    .setColor(yellow)
    .setURL(embedURL)
    .setTimestamp()
    .addField("Status", strStatus);

    activities.forEach(act => {
        const { type, assets, emoji, state, details, name } = act;
        const title = type === "PLAYING"       ? "Spiller"  :
                      type === "STREAMING"     ? "Streamer" :
                      type === "LISTENING"     ? "Hører på" :
                      type === "WATCHING"      ? "Ser på"   :
                      type === "CUSTOM_STATUS" ? "Custom"   :
                      "K-konkulelel🧛‍♂️";
        const image = assets?.largeImageURL() || assets?.smallImageURL();
        let content;

        if (type === "CUSTOM_STATUS") {
            emoji ? content = `${emoji.name} ${state}` : state
        }
        
        else if (type === "LISTENING") {
            const base = state ? `${state.split("; ").join(", ")} - **${details}**` : name;
            content = assets.largeText ? `${base}\nfra ${assets.largeText}` : base;
        }
        
        else {
            content = name;
        }
        
        if (image) actEmbed.setThumbnail(image);
        actEmbed.addField(title, content);
    });

    channel.send(actEmbed);

    botLog(chalk `{grey Used} ACTIVITIES {grey on} ${user.tag} {grey (${user.id})}`);
}
