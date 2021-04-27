module.exports = { name: "ready" }

// --------------------------------------------------------------

module.exports.run = async (client) => {
	const { user, guilds } = client;

// --------------------------------------------------------------

	user.setActivity("lolol", { type: "LISTENING" }).catch(console.error);
	console.log(`Logged in as ${user.tag} in ${guilds.cache.size} servers.`);
}
