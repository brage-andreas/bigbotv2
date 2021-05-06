const { yellow, red, green } = require("chalk");
const chalk = require("chalk");
const mongoose = require("mongoose");

const configSchema = require("./mongoSchemes/config-schema.js");
const { mPath } = require("./settings.json");



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
        "time"        : "838012899418963979",
        "err"         : "830465898061889566",
        "adm"         : "830465921205665803"
    }

    const clientEmojiID = emojiTable[emoji];

    if (!clientEmojiID) return null;
    else return client.emojis.cache.get(clientEmojiID);
}



// --------------------------------------------------------------



const getColours = async (id, format=false) => {
    String.prototype.r = function() { return `hex("${this.replace("#", "")}")` }
    let { yellow, red, green } = await config(id);

    return format ? { yellow: yellow.r(), red: red.r(), green: green.r() } : { yellow: yellow, red: red, green: green };
}



// --------------------------------------------------------------



const cache = {};
const chatLog = async (message) => { 
    const { green, yellow } = await getColours(message.client.user.id, true);
    const { guild, author, channel, attachments, embeds, edits, content } = message;
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
    const strAuthor  = chalk `{${green} ${author.tag}}`;
    const strChannel = chalk `{${yellow} #${channel.name}}`;

    const base = cache.lastUserID !== author.id || cache.lastChannelID !== channel.id
               ? `\n${strAuthor} ${strID} ${strChannel} ${strGuild}\n`
               : "";
    const edit = edits.length>1 ? chalk ` {${yellow} EDIT} ${edits[1]} {${yellow} =>}` : ""

    console.log(chalk `${base}${strTime} {grey >}${edit} ${content} {grey < ${extras}}`);

    cache.lastChannelID = channel.id;
    cache.lastUserID    = author .id;
}


const botLog = async (id, custom, guildName=null, channelName=null) => {
    const { red, yellow } = await getColours(id, true);
    const [ sec, min, hour ] = time();

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strChannel = channelName ? chalk `{${yellow} #${channelName}} ` : "";
    const strGuild   = guildName   ? chalk `{grey in "${guildName}"} `        : "";

    console.log(chalk `\n{${red} ~/ CLIENT} ${strChannel}${strGuild}\n   ${strTime} ${custom}`);

    cache.lastChannelID = null;
    cache.lastUserID    = null;
}



// --------------------------------------------------------------



const parseCreatedJoinedAt = (created, joined) => {
    Number.prototype.zero = function() { return this<10 ? "0"+this : this };
    const date = new Date();

    if (!created && !joined) return null;

    const getTime = (tm) => {
        let year   =  tm.getFullYear().zero();
        let minute =  tm.getMinutes() .zero();
        let month  = (tm.getMonth()+1).zero();
        let hour   =  tm.getHours()   .zero();
        let dato   =  tm.getDate()    .zero();

        let made = [`\`${year}-${month}-${dato} ${hour}:${minute}\``];

        let minsAgo  = (date-tm)/60000;
        let hoursAgo = (date-tm)/3600000;
        let daysAgo  = (date-tm)/86400000;
        let yearsAgo = (date-tm)/31536000000;
        
        if (minsAgo <1) made.push("Under ett minutt siden");               else
        if (hoursAgo<1) made.push(`${Math.ceil(minsAgo)} minutter siden`); else
        if (daysAgo <1) made.push(`${Math.ceil(hoursAgo)} timer siden`);   else
        if (yearsAgo<1) made.push(`${Math.ceil(daysAgo)} dager siden`);
                   else made.push(`${yearsAgo.toFixed(1).replace(".", ",")} år siden`);

        return made.join("\n");
    }

    let fMade, fCame;
    if (created) fMade = getTime(created);
    if (joined)  fCame = getTime(joined);

    if ( fMade &&  fCame) return [fMade, fCame]; else
    if ( fMade && !fCame) return  fMade; else
    if (!fMade &&  fCame) return  fCame;
    else return null;
}



// --------------------------------------------------------------



module.exports = { time, emoji, getColours, chatLog, botLog, parseCreatedJoinedAt, mongo, config };
