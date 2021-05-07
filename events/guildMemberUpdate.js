const chalk             = require("chalk");
const nickSchema        = require("../files/mongoSchemes/nick-schema.js");
const { mongo, botLog } = require("../files/auto.js");

// --------------------------------------------------------------

module.exports = { name: "guildMemberUpdate" }

// --------------------------------------------------------------

module.exports.run = async (client, past, present) => {

    if (past.displayName !== present.displayName) {
        botLog(client.user.id, chalk `{grey New name for} ${present.user.tag} {grey (${present.user.id})} | "${past.displayName}" => "${present.displayName}"`, present.guild.name);

        if (present.guild.id !== "486548195137290265") return;
        await mongo().then(async mongoose => {
            try {
                await nickSchema.findOneAndUpdate(
                    { _id: present.user.id },
                    {
                        _id: present.user.id,
                        $push: { names: present.displayName }
                    },
                    { upsert: true }
                );
            } finally {
                mongoose.connection.close();
            }
        });
    }
}
