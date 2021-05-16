require("module-alias/register");
const Discord   = require("discord.js");
const chalk     = require("chalk");
const fs        = require("fs");
const { token } = require("@files/settings.json");


const yellow = "hex('#FFC152')";
const client = new Discord.Client({
	ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'] }
});

client.commands = new Discord.Collection();


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
process.stdout.write("\033c");
console.log(chalk `{${yellow} ${logo}}`);


const getJsFiles = async (dir) => {
	const files = fs.readdirSync(dir);

    return files.filter(file => file.endsWith(".js")); 
}


getJsFiles("./commands/").then(commandFiles => {
    console.log(chalk `{grey Loading} {${yellow} ${commandFiles.length}} {grey commands •••}`);
	commandFiles.forEach(file => {
		const command = require(`@cmds/${file}`);
		client.commands.set(command.name, command);
	});
    console.log("Done!\n\n");
});


getJsFiles("./events/").then(eventFiles => {
	eventFiles.forEach(file => {
		const event = require(`@events/${file}`);
		if (event) client.on(event.name, (...args) => event.run(client, ...args));
	});
});


client.login(token);
