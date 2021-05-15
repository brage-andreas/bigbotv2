require("module-alias/register");
const chalk      = require("chalk");
const nickSchema = require("@schemas/nick-schema.js");
const { botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = { name: "guildMemberUpdate" }

// --------------------------------------------------------------

module.exports.run = async (client, past, present) => {

    if (past.displayName !== present.displayName) {
        botLog(client.user.id, chalk `{grey New name for} ${present.user.tag} {grey (${present.user.id})} | "${past.displayName}" => "${present.displayName}"`, present.guild.name);

        if (present.guild.id !== "486548195137290265") return;
        
        await nickSchema.findOneAndUpdate(
            { _id: present.user.id },
            {
                _id: present.user.id,
                $push: { names: present.displayName }
            },
            { upsert: true }
        );
    }
}
