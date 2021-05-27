require("module-alias/register");
const chalk = require("chalk");
const { emoji, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["ping", "heartbeat", "hb"],
	use: "ping <-all>",
	about: "ping pong ching chong xD",
	category: "info"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client, channel } = message;
    const [strength1, strength2, strength3] = emoji(client, ["strength1", "strength2", "strength3"]);
    const all = args[0] === "-all";

    channel.send("...").then(msg => {
        const heartbeat = client.ws.ping;
        const absPing   = msg.createdTimestamp-message.createdTimestamp;
        const ping      = absPing-heartbeat<0 ? absPing-heartbeat*-1 : absPing-heartbeat;
        const emoji     = ping > 300 ? strength1 : ping > 75 ? strength2 : strength3;

        if (all) msg.edit(`Ping/absolutt: \`${ping}/${absPing} ms\`\nWS heartbeat: \`${heartbeat} ms\``);
        else     msg.edit(`Ping: ${emoji} ${ping} ms`);
    });

    botLog(client.user.id, chalk `{grey Used} PING {grey and got} ${ping}/${absPing} {grey (WSHB: ${heartbeat})}`);
}
