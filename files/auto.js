require("module-alias/register");
const chalk    = require("chalk");
const mongoose = require("mongoose");

const configSchema = require("@schemas/config-schema.js");
const { mPath }    = require("@files/settings.json");

const twoCharLength = (num) => num<10 ? String("0"+num) : String(num);



// --------------------------------------------------------------



const mongo = async () => {
    await mongoose.connect(mPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        keepAlive: true
    });
    
    return mongoose;
}

const config = async (id) => await configSchema.findOne({ _id: id });



// --------------------------------------------------------------



/**
 * @returns sec, min, hour [ ]
 */
const time = () => {
    const now = new Date;
    
    const sec  = now.getSeconds();
    const min  = now.getMinutes();
    const hour = now.getHours();
    
    const secMinHourArray = [ twoCharLength(sec), twoCharLength(min), twoCharLength(hour) ];
    return secMinHourArray;
}


const emoji = (client, emoji) => {
    const emojiTable = {
        "questionmark": "830465898154033192",
        "strength3"   : "847464247856201738",
        "strength2"   : "847464247985569812",
        "strength1"   : "847464247867736104",
        "check"       : "830470096698081330",
        "time"        : "838012899418963979",
        "err"         : "830465898061889566",
        "adm"         : "830465921205665803"
    }

    if (emoji === "fullTable") return emojiTable;

    if (Object.prototype.toString.call(emoji) === "[object Array]") {
        let emojiArray = emoji.map(em => {
            const clientEmojiID = emojiTable[em];
            return client.emojis.cache.get(clientEmojiID);
        });

        return emojiArray;
    }
    
    else {
        const clientEmojiID = emojiTable[emoji];
    
        if (!clientEmojiID) return null;
        return client.emojis.cache.get(clientEmojiID);
    }

}



// --------------------------------------------------------------



const getColours = async (id, format=false) => {
    // fix
    const chalkFormat = (str) => `hex("${str.replace("#", "")}")`; // hex("ff2233")
    
    // TODO: logikk for om yellow, red og green allerede finnes
    
    let { yellow, red, green } = await config(id);
    
    if (format) {
        yellow = chalkFormat(yellow);
        green  = chalkFormat(green);
        red    = chalkFormat(red);
    }
    
    const colourObj = {
        "yellow": yellow,
        "green" : green,
        "red"   : red
    };
    
    return colourObj;
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
    const date = new Date();

    if (!created && !joined) return null;

    const getTime = (time) => {
        const month  = twoCharLength(time.getMonth()+1 );
        const minute = twoCharLength(time.getMinutes() );
        const hour   = twoCharLength(time.getHours()   );
        const dato   = twoCharLength(time.getDate()    );
        const year   = twoCharLength(time.getFullYear());

        return `\`${year}-${month}-${dato} ${hour}:${minute}\``;
    }

    const getTimeSince = (time) => {
        const minsAgo  = (date-time)/60000;       // * 1000 * 60
        const hoursAgo = (date-time)/3600000;     // * 1000 * 60 * 60
        const daysAgo  = (date-time)/86400000;    // * 1000 * 60 * 60 * 24
        const yearsAgo = (date-time)/31536000000; // * 1000 * 60 * 60 * 24 * 365

        let returnStr;

        if (minsAgo <1)      returnStr = "Under ett minutt siden";
        else if (hoursAgo<1) returnStr = `${Math.ceil(minsAgo)} minutter siden`;
        else if (daysAgo <1) returnStr = `${Math.ceil(hoursAgo)} timer siden`;
        else if (yearsAgo<1) returnStr = `${Math.ceil(daysAgo)} dager siden`;
        /* --------- */ else returnStr = `${yearsAgo.toFixed(1).replace(".", ",")} år siden`;

        return returnStr;
    }

    let formattedMade, formattedCame;

    if (created) {
        let timeMade      = getTime(created);
        let timeSinceMade = getTimeSince(created);

        formattedMade = `${timeMade}\n${timeSinceMade}`;
    }

    if (joined) {
        let timeCame      = getTime(joined);
        let timeSinceCame = getTimeSince(joined);

        formattedCame = `${timeCame}\n${timeSinceCame}`;
    }

    if (created && joined) return [formattedMade, formattedCame];
    if (created) return formattedMade;
    if (joined)  return formattedCame;
    return null;
}



// --------------------------------------------------------------



module.exports = { time, emoji, getColours, chatLog, botLog, parseCreatedJoinedAt, mongo, config };
