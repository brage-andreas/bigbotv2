require("module-alias/register");
const chalk = require("chalk");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const { emoji, botLog } = require("@auto");

// --------------------------------------------------------------

module.exports = {
	names: ["quote", "q"],
	use: "quote <@user|userID> tekst",
	about: "Sitér noen",
	category: "fun"
}

// --------------------------------------------------------------

module.exports.run = async (message, args) => {
    const { mentions, guild, author, client, channel } = message;

    const quoteText = (ctx, text, x, y, maxWidth, lineHeight) => {
        let str = text.split("\n");
        str.forEach(s => {
            let line = "";
            let words = s.split(" ");
            words.forEach(w => {
                let testLine = line + w + " ";
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxWidth) {
                    ctx.fillText(line, x, y);
                    line = w + " ";
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line, x, y);
            y += lineHeight;
        });
    }

    const memberNameText = (canvas, text, font, fontSize) => {
        const ctx = canvas.getContext('2d');

        ctx.font = `bold ${fontSize}px ${font}`
        while (ctx.measureText(text).width > canvas.width - 425) {
            ctx.font = `${fontSize -= 5}px ${font}`;
        }
        return ctx.font;
    }

    const memberRaw = mentions.members.first() || guild.members.cache.get(args[0]);

    if (memberRaw) args.shift();
    const member    = memberRaw?.displayName || message.member.displayName;
    const avatarRaw = memberRaw?.user.displayAvatarURL({ format: "png", size: 1024 }) || author.displayAvatarURL({ format: "png", size: 1024 });
    
    if (!args.length) return message.react(emoji(client, "err"));
    if (!member)       return message.react(emoji(client, "err"));


    // -- Creating the canvas ----------------------------------
    const canvas = Canvas.createCanvas(1500, 500);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage("https://wallpapercave.com/wp/wp3493593.jpg");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


    // -- Drawing the name -------------------------------------
    ctx.font = memberNameText(canvas, member, "Comic Sans MS", 58);
    ctx.fillStyle = '#6eff6e';

    ctx.fillText(member, 400, 82.5);


    // -- Drawing the text -------------------------------------
    ctx.fillStyle = '#f2f2f2';

    ctx.font = "58px Comic Sans MS";
    quoteText(ctx, args.join(" "), 400, 175, (canvas.width - 440), 70);


    // -- Drawing the avatar -----------------------------------
    ctx.beginPath();
    ctx.arc(200, 250, 150, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(avatarRaw);
    ctx.drawImage(avatar, 50, 100, 300, 300);


    // -- Making and sending the image -------------------------
    const attachment = new MessageAttachment(canvas.toBuffer(), `quote-${message.author.id}.png`);

    message.delete();
    channel.send(attachment);

    botLog(client.user.id, chalk `{grey Used} QUOTE {grey on} ${memberRaw?.user.tag || author.tag} {grey (${memberRaw?.user.id || author.id})}`);
}
