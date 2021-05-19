require("module-alias/register");
const chalk = require("chalk");
const nickSchema = require("@schemas/nick-schema.js");
const { MessageEmbed } = require("discord.js");
const { config, emoji, parseCreatedJoinedAt, mongo, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	name: ["userinfo", "memberinfo", "ui", "mi"],
	use: "userinfo <@user|userID>",
	about: "Sender diverse informasjon om en bruker.",
	category: "info"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
	const { client, mentions, guild, channel } = message;
    const { embedURL } = await config(client.user.id);

    const member = mentions.members.first() || guild.members.cache.get(args[0]) || message.member;
    const user   = member?.user;

    if (!member) return message.react(emoji(client, "err"));

    const [made, came] = parseCreatedJoinedAt(user.createdAt, member.joinedAt);
    const roles        = Array.from(member.roles.cache.filter(r => r.name !== "@everyone").values());

    await mongo();
    const nicks = await nickSchema.findOne({ _id: user.id });

    const status = member.presence.status === "online" ? "🟩 Online"         :
                   member.presence.status === "idle"   ? "🟨 Idle"           :
                   member.presence.status === "dnd"    ? "🟥 Do Not Disturb" :
                                                         "⬛ Offline";

    const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });

    const infoEmbed = new MessageEmbed()
    .setColor(member.displayHexColor !== "#000000" ? member.displayHexColor : "RANDOM")
    .setThumbnail(avatar)
    .setTitle(member.displayName)
    .setURL(embedURL)
    .addField("Brukernavn", `${user.tag}`, true)
    .addField("Avatar", `[Link](${avatar})`, true)
    .addField("ID", `\`${user.id}\``)
    .addField("Bruker laget", made, true)
    .addField(`Kom til ${guild.name}`, came, true)
    .addField("Status", `${status}`)
    .setTimestamp();

    if (roles.length) infoEmbed.addField("Roller", roles.join(", "))
    if (nicks?.names.length && guild.id === "486548195137290265") infoEmbed.addField("Navn", `"${nicks.names.reverse().join('"\n"')}"`);
    if (guild.ownerID === user.id) infoEmbed.setDescription(`👑 Eieren av serveren`);

    channel.send(infoEmbed);

    botLog(client.user.id, chalk `{grey Used} USERINFO {grey on} ${user.tag} {grey ${user.id}}`);
}
