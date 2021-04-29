const chalk = require("chalk");
const mongoose = require("mongoose");

const configSchema = require("./mongoSchemes/config-schema.js");
const { mPath } = require("./settings.json");

const colours = {};



// --------------------------------------------------------------



/**
 * @returns [sec, min, hour]
 */
const time = () => {
    const nil = (num) => num<10 ? String("0"+num) : String(num);
    const date = new Date();
    return [ nil(date.getSeconds()), nil(date.getMinutes()), nil(date.getHours()) ];
}


const emoji = (client, emoji) => {
    const emojiTable = {
        "questionmark": "830465898154033192",
        "check"       : "830470096698081330",
        "err"         : "830465898061889566",
        "adm"         : "830465921205665803"
    }

    const clientEmojiID = emojiTable[emoji];

    if (!clientEmojiID) return null;
    else return client.emojis.cache.get(clientEmojiID);
}



// --------------------------------------------------------------



const cache = {};
const chatLog = (message) => { 
    const { guild, author, channel, attachments, embeds, edited, content } = message;
    const [ sec, min, hour ] = time();

    const attachs     = attachments?.map(attachment => attachment.url).join("; ");

    const embedAmount = embeds?.filter(embed => embed.type === "rich");
    const embs        = embedAmount.size ? `${embedAmount.size} embed(s)` : null;

    if ( attachs.length &&  embs) extras = `${attachs} -- ${embs}`; else
    if ( attachs.length && !embs) extras = attachs;                 else
    if (!attachs.length &&  embs) extras = embs;                    else
                                  extras = "";

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strGuild   = chalk `{grey in "${guild.name}"}`;
    const strID      = chalk `{grey (${author.id})}`;
    const strAuthor  = chalk `{green ${author.tag}}`;
    const strChannel =       `#${channel.name}`;

    const base = cache.lastUserID !== author.id && cache.lastChannelID !== channel.id
               ? `\n${strAuthor} ${strID} ${strChannel} ${strGuild}\n`
               : "";

    console.log(chalk `${base}${strTime} {grey >}${edited ? " <EDIT>: " : ""} ${content} {grey < ${extras}}`);

    cache.lastChannelID = channel.id;
    cache.lastUserID    = author .id;
}


const botLog = (custom, guildName=null, channelName=null) => {
    const [ sec, min, hour ] = time();

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strChannel = channelName ? `#${channelName} `                : "";
    const strGuild   = guildName   ? chalk `{grey in "${guildName}"} ` : "";

    console.log(chalk `${strTime} {red ~/ CLIENT} ${strChannel}${strGuild}{grey >} ${custom}`);
}



// --------------------------------------------------------------



const parseCreatedJoinedAt = () => {
    //
}



// --------------------------------------------------------------



const mongo = async () => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    await mongoose.connect(mPath, options);
    return mongoose;
}

const config = async (id) => {
    let data;
    await mongo().then(async mongoose => {
        try {
            data = await configSchema.findOne({ _id: id });
        }
        
        finally {
            mongoose.connection.close();
        }
    });
    return data;
}



// --------------------------------------------------------------



module.exports = { time, emoji, chatLog, botLog, parseCreatedJoinedAt, mongo, config };
