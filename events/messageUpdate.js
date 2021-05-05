const msgEvent = require("./message.js");

// --------------------------------------------------------------

module.exports = { name: "messageUpdate" }

// --------------------------------------------------------------

module.exports.run = async (client, past, present) => {
    if (past.content === present.content || present.author.bot) return;

    present.channel.messages.fetch({ limit: 1, after: present.id}).then(message => {
        const botmsg = message.first();
        if (botmsg && !botmsg?.author.id === client.user.id) return;
        
        present.reactions.removeAll();
        msgEvent.run(client, present);
    });
}
