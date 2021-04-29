const chalk = require("chalk");

// --------------------------------------------------------------

module.exports = { name: "ready" }

// --------------------------------------------------------------

module.exports.run = async (client) => {
    const yellow = "rgb(255, 174, 66)"
	const { user, guilds } = client;

	user.setActivity("lolol", { type: "LISTENING" }).catch(console.error);
	
    console.log(chalk `${yellow} ┌────────────────────┐}`)
    console.log(chalk `{rgb(255, 174, 66) │} ${hour}:${min}:${sec} • {rgb(110, 255, 110) Started} {rgb(255, 174, 66) │}`);
    console.log(chalk `{rgb(255, 174, 66) └────────────────────┘}\n\n`)
    
    console.log(chalk `{rgb(255, 174, 66) │} {grey Alias} ${bot.user.tag} {grey (${bot.user.id})}`);
    console.log(chalk `{rgb(255, 174, 66) │} {grey In} ${bot.guilds.cache.size} {grey servers and} ${bot.channels.cache.size} {grey channels}`);
    console.log(chalk `{rgb(255, 174, 66) │} {grey DB successfully connected}`);

    console.log("\n");
}
