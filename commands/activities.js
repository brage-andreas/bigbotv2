const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { emoji, config, getColours, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["activities", "activity", "acts", "status", "presence"],
	use: "activities @user|userID <-type ...>",
	about: 'Sender hva brukeren gjør. Typer kan være "__p__laying", "__w__atching", "__s__treaming", "__l__istening", "__c__ustom", "competing" og/eller "status".',
	category: "info"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { mentions, guild, member, client, channel } = message;
    const { embedURL } = await config(client.user.id);
    const { yellow } = await getColours(client.user.id);

    const getStatus = (s) => s === "online" ? "🟩 Online" : s === "idle" ? "🟨 Idle" : s === "dnd" ? "🟥 Do Not Disturb" : "⬛ Offline";

    const guildMember = mentions.members.first() || guild.members.cache.get(args[0]) || member;

    if (!guildMember) return message.react(emoji(client, "err"));

    const filters = [];
    if (args.join(" ").includes("-")) {
        args.forEach(arg => {
            if (arg === "-playing"   || arg === "-p") filters.push("PLAYING");       else
            if (arg === "-streaming" || arg === "-s") filters.push("STREAMING");     else
            if (arg === "-listening" || arg === "-l") filters.push("LISTENING");     else
            if (arg === "-watching"  || arg === "-w") filters.push("WATCHING");      else
            if (arg === "-custom"    || arg === "-c") filters.push("CUSTOM_STATUS"); else
            if (arg === "-competing"                ) filters.push("COMPETING");     else
            if (arg === "-status"                   ) filters.push("STATUS");
        });
        if (!filters.length) return message.react(emoji(client, "err"));
    }

    const { presence, user }     = guildMember;
    const { activities, status } = presence;
    const name = guildMember.displayName;


    const actEmbed = new MessageEmbed()
    .setTitle(!name.endsWith("s") && !name.endsWith("z") ? `${name}s aktiviteter` : `${name}' aktiviteter`)
    .setColor(yellow)
    .setURL(embedURL)
    .setTimestamp();

    
    if (!filters.length || filters?.some(filter => filter === "STATUS")) actEmbed.addField("Status", getStatus(status));


    const filteredActivities = filters.length ? activities.filter(act => filters.some(filter => act.type === filter)) : activities;
    
    if (!filteredActivities.length && !actEmbed.fields.length) actEmbed.setDescription("Ingenting smh");
    else filteredActivities.forEach(act => {
        const { type, assets, emoji, state, timestamps, details, name } = act;

        const title = type === "PLAYING"       ? "Spiller"  :
                      type === "STREAMING"     ? "Streamer" :
                      type === "LISTENING"     ? "Hører på" :
                      type === "WATCHING"      ? "Ser på"   :
                      type === "CUSTOM_STATUS" ? "Custom"   :
                      "K-konkulelel🧛‍♂️";
        const image = assets?.largeImageURL() || assets?.smallImageURL();
        let content;

        switch (type) {
            case "CUSTOM_STATUS":
                content = emoji ? `${emoji.name} ${state}` : state
                break;
            
            case "LISTENING":
                const base = state ? `${state.split("; ").join(", ")} - **${details}**` : name;
                content = assets?.largeText ? `${base}\nfra ${assets.largeText}` : base;
                break;
    
            case "PLAYING":
                if (details) {
                    const base = `${name}\n${details ? details : ""}${state ? " - "+state : ""}`;
                    content = assets?.largeText ? `${base} som **${assets.largeText}**` : base;
                }
    
                else if (state) content = assets?.largeText ? `${name}\n${state} som **${assets.largeText}**` : state;
                else content = name;
                break;
        
            default:
                content = name;
                break;
        }
        
        if (image) actEmbed.setThumbnail(image);
        actEmbed.addField(title, content);
    });

    channel.send(actEmbed);

    botLog(client.user.id, chalk `{grey Used} ACTIVITIES {grey on} ${user.tag} {grey (${user.id})}`);
}
