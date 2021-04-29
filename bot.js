const Discord = require("discord.js");
const chalk   = require("chalk");
const fs      = require("fs");

// --------------------------------------------------------------

const yellow = "hex('#FFC152')";
const client = new Discord.Client({
	ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'] }
});
const { token } = require("./files/settings.json");

client.commands = new Discord.Collection();

// --------------------------------------------------------------

const logo = `
                      BIG BOT
                      PROJECT
                                   ==@@@@@@@@@@@=
                                =@@@@@@@@@@@@@@@@@@=
                              =@@@@@@@@======@@@@@@@@@
                ====         @@@@@@@=          =@@@@@@@=
          ==@@@@@@@@@@@@==  @@@@@@=              =@@@@@@=
        @@@@@@@@@@@@@@@@@@@@@@@@@=                =@@@@@@
      @@@@@@@@@=======@@@@@@@@@@@                  @@@@@@
    =@@@@@@@=           =@@@@@@@@=                =@@@@@@
   =@@@@@@=               =@@@@@@@=              =@@@@@@
   @@@@@@=                 @@@@@@@@@==         =@@@@@@@=
   @@@@@@                  =@@@@@@@@@@@@=====@@@@@@@@=
   @@@@@@=                 @@@@@@@@@@@@@@@@@@@@@@@@=
    @@@@@@=               @@@@@@@   =@@@@@@@@@@==
    =@@@@@@@=          ==@@@@@@@
      @@@@@@@@@======@@@@@@@@@=
        =@@@@@@@@@@@@@@@@@@@=
           ==@@@@@@@@@@@==
\n\n`;
console.clear();
console.log(logo);

// --------------------------------------------------------------

const getJsFiles = async (dir) => {
	const files = fs.readdirSync(dir)

    return files.filter(file => file.endsWith(".js")); 
}

// -- Commands --------------------------------------------------

getJsFiles("./commands/").then(commandFiles => {
    console.log(chalk `{grey Loading} {${yellow} ${commandFiles.length}} {grey commands •••}`);
	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	});
    console.log("                  Done!\n\n");
});

// -- Events ----------------------------------------------------

getJsFiles("./events/").then(eventFiles => {
	eventFiles.forEach(file => {
		const event = require(`./events/${file}`);
		if (event) client.on(event.name, (...args) => event.run(client, ...args));
	});
});

// -- Login ------------------------------------------------------

client.login(token);
