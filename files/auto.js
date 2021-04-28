const chalk = require("chalk");

/**
 * @returns [sec, min, hour]
 */
const time = () => {
    const nil = (num) => num<10 ? String("0"+num) : String(num);
    const date = new Date();
    return [ nil(date.getSeconds()), nil(date.getMinutes()), nil(date.getHours()) ];
}


// --------------------------------------------------------------


const cache = {};
const chatLog = (message) => { 
    const { guild, author, channel, attachments, embeds, edited, content } = message;
    const [ sec, min, hour ] = time();

// --------------------------------------------------------------

    const attachs     = attachments?.map(attachment => attachment.url).join("; ");

    const embedAmount = embeds?.filter(embed => embed.type === "rich");
    const embs        = embedAmount.size ? `${embedAmount.size} embed(s)` : null;

    if ( attachs.length &&  embs) extras = `${attachs} -- ${embs}`; else
    if ( attachs.length && !embs) extras = attachs;                 else
    if (!attachs.length &&  embs) extras = embs;                    else
                                  extras = "";

// --------------------------------------------------------------

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strGuild   = chalk `{grey in "${guild.name}"}`;
    const strID      = chalk `{grey (${author.id})}`;
    const strAuthor  = chalk `{green ${author.tag}}`;
    const strChannel =       `#${channel.name}`;

// --------------------------------------------------------------

    const base = cache.lastUserID !== author.id && cache.lastChannelID !== channel.id
               ? `\n${strAuthor} ${strID} ${strChannel} ${strGuild}\n`
               : "";

// --------------------------------------------------------------

    console.log(chalk `${base}${strTime} {grey >}${edited ? " <EDIT>: " : ""} ${content} {grey < ${extras}}`);

// --------------------------------------------------------------

    cache.lastChannelID = channel.id;
    cache.lastUserID    = author .id;
}

const botLog = (custom, guildName=null, channelName=null) => {
    const [ sec, min, hour ] = time();

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strChannel = channelName ? `#${channelName} `               : "";
    const strGuild   = guildName   ? chalk `{grey in "${guildname}"}` : "";

    console.log(chalk `${strTime} {red CLIENT} ${strChannel}${strGuild} {grey >} ${custom}`);
}


// --------------------------------------------------------------


const parseCreatedJoinedAt = () => {
    //
}


// --------------------------------------------------------------


module.exports = { time, chatLog, botLog, parseCreatedJoinedAt };