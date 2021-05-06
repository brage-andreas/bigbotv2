const chalk = require("chalk");
const { getColours, config, time } = require("../files/auto");

// --------------------------------------------------------------

module.exports = { name: "ready" }

// --------------------------------------------------------------

module.exports.run = async (client) => {
    const { activity, activitytype } = await config(client.user.id);
    const { yellow, green }          = await getColours(client.user.id, true);
	const { user, guilds, channels } = client;
    const [sec, min, hour]           = time();

	user.setActivity(activity, { type: activitytype }).catch(console.error);
	
    console.log(chalk `{${yellow} ┌────────────────────┐}`)
    console.log(chalk `{${yellow} │} ${hour}:${min}:${sec} • {${green} Started} {${yellow} │}`);
    console.log(chalk `{${yellow} └────────────────────┘}\n\n`)
    
    console.log(chalk `{${yellow} │} {grey Alias} ${user.tag} {grey (${user.id})}`);
    console.log(chalk `{${yellow} │} {grey In} ${guilds.cache.size} {grey servers and} ${channels.cache.size} {grey channels}`);
    console.log(chalk `{${yellow} │} {grey DB successfully connected}`);

    console.log("\n");
}
