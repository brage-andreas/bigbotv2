require("module-alias/register");
const chalk    = require("chalk");
const mongoose = require("mongoose");

const configSchema = require("@schemas/config-schema.js");
const { mPath }    = require("@files/settings.json");



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
 * @returns sec, min, hour
 */
const time = () => {
    const twoCharLength = (num) => num<10 ? String("0"+num) : String(num);
    const now = new Date;
    
    const sec  = Date.getSeconds();
    const min  = Date.getMinutes();
    const hour = Date.getHours();
    
    const secMinHourArray = [ twoCharLength(sec), twoCharLength(min), twoCharLength(hour) ];
    return secMinHourArray;
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



let colourObj = {};
const getColours = async (id, format=false) => {
    // fix
    const chalkFormat = (str) => `hex("${str.replace("#", "")}")`; // hex("ff2233")
    const addColoursToObj = (...colours) => colours.forEach(colour => colourObj[colour] = colour);
    
    // TODO: logikk for om yellow, red og green allerede finnes
    
    //let { yellow, red, green } = await config(id);
    let logTest = await config(id);
    console.log(logTest);
    let { yellow, red, green } = logTest;
    
    if (format) {
        yellow = chalkFormat(yellow);
        green  = chalkFormat(green);
        red    = chalkFormat(red);
    }
    
    addColoursToObj(yellow, green, red);
    
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
    Number.prototype.zero = function() { return this<10 ? "0"+this : this };
    const date = new Date();

    if (!created && !joined) return null;

    const getTime = (tm) => {
        let month  = (tm.getMonth()+1).zero();
        let year   =  tm.getFullYear().zero();
        let minute =  tm.getMinutes() .zero();
        let hour   =  tm.getHours()   .zero();
        let dato   =  tm.getDate()    .zero();

        let made = [`\`${year}-${month}-${dato} ${hour}:${minute}\``];

        let minsAgo  = (date-tm)/60000;       // * 1000 * 60
        let hoursAgo = (date-tm)/3600000;     // * 1000 * 60 * 60
        let daysAgo  = (date-tm)/86400000;    // * 1000 * 60 * 60 * 24
        let yearsAgo = (date-tm)/31536000000; // * 1000 * 60 * 60 * 24 * 365
        
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
