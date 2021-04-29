module.exports = {
	name: ["join"],
	use: "2",
	about: "3",
	category: "",
	cooldown: 0
}

// --------------------------------------------------------------

module.exports.run = (message, args) => {
	const guildMemberAdd = require("../events/guildMemberAdd.js");
    guildMemberAdd.run(message.member);
}
