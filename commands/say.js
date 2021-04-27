module.exports = {
	name: ["say"],
	use: "say tekst",
	about: "Si noe",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const { client, channel } = message;
	
	message.delete();
	if (!args.length) return channel.send("🤐");
	
	channel.send(args.join(" "));
}
