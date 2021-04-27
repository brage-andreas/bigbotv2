module.exports = { name: "ready" }

// --------------------------------------------------------------

module.exports.run = async (client) => {
	console.log(`Logged in as ${client.user.tag} in ${client.guilds.size} servers.`);
}
