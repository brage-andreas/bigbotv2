const chalk        = require("chalk");
const configSchema = require("../files/mongoSchemes/config-schema.js");

const { config, emoji, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = {
	name: ["setactivity", "sa"],
	use: "setactivity type aktivitet",
	about: "Få BIG BOT til å gjøre noe. Typer er \"playing\" (p), \"watching\" (w) og \"listening\" (l).",
	category: "management"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { client } = message;

	const { admins } = await config(client.user.id);
    if (!admins.some(adm => message.author.id === adm)) return message.react(emoji(client, "adm"));

    const getType = argument => {
        if (["PLAYING",   "P"].some(e => e === argument?.toUpperCase())) { args.shift(); return "PLAYING";   } else 
        if (["WATCHING",  "W"].some(e => e === argument?.toUpperCase())) { args.shift(); return "WATCHING";  } else
        if (["LISTENING", "L"].some(e => e === argument?.toUpperCase())) { args.shift(); return "LISTENING"; } else
        return "WATCHING";
    }

    const type     = args.length ? getType(args[0]) : null;
    const activity = args.length ? args.join(" ")   : null;

    client.user.setActivity(activity, { type: type })
	.then(message.react(emoji(client, "check")))
    .catch(console.error);


    await configSchema.findOneAndUpdate(
        { _id: client.user.id },
        {
            activity: activity,
            activitytype: type
        },
        { upsert: true }
    );

    const logcontent = type ? "to set a new activity with type:" : "to reset";
    botLog(client.user.id, chalk `{grey Used} SETACTIVITY {grey ${logcontent}} ${type}`)
}
