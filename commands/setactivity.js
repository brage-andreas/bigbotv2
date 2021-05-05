const chalk        = require("chalk");
const configSchema = require("../files/mongoSchemes/config-schema.js");

const { config, emoji, mongo, botLog } = require("../files/auto.js");

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
        if (["PLAYING",   "P"].some(e => e === argument?.toUpperCase())) { args.shift(); return "PLAYING";   }
        if (["WATCHING",  "W"].some(e => e === argument?.toUpperCase())) { args.shift(); return "WATCHING";  }
        if (["LISTENING", "L"].some(e => e === argument?.toUpperCase())) { args.shift(); return "LISTENING"; }
        return "WATCHING";
    }

    const type     = args.length ? getType(args[0]) : null;
    const activity = args.length ? args.join(" ")   : null;

    client.user.setActivity(activity, { type: type })
	.then(message.react(emoji(client, "check")))
    .catch(console.error);

    await mongo().then(async mongoose => {
		try {
			await configSchema.findOneAndUpdate(
				{ _id: client.user.id },
				{
					activity: activity,
					activitytype: type
				},
				{ upsert: true }
			);
		} finally {
			mongoose.connection.close();
		}
	});

    type ? botLog(chalk `{grey Used} SETACTIVITY {grey to set a new activity, with type:} ${type}`)
         : botLog(chalk `{grey Used} SETACTIVITY {grey to reset}`);
}
