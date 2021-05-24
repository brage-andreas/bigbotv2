require("module-alias/register");
const chalk = require("chalk");
const { botLog } = require("@auto");

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
    const all = args[0] === "-all";

    channel.send("...").then(msg => {
        let heartbeat = client.ws.ping;
        let ping   = msg.createdTimestamp-message.createdTimestamp-heartbeat;
        let absPing   = msg.createdTimestamp-message.createdTimestamp;

        if (all) msg.edit(`Ping/absolutt: \`${ping<0 ? ping*-1 : ping}/${absPing} ms\`\nWS heartbeat: \`${heartbeat} ms\``);
        else     msg.edit(`Ping: ${ping} ms`);
    });

    botLog(client.user.id, chalk `{grey Used} PING`);
}
