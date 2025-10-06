const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require("discord.js");
const fs = require("fs");
const cf = require("./config/config.js");
const db = require("croxydb")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

client.login(cf.token);

client.commands = new Collection();

fs.readdirSync("./commands").forEach(file => {
    const command = require(`./commands/${file}`);
    if (command.help && command.data) {
        client.commands.set(command.help.name, command);
    }
});

const rest = new REST({ version: '10' }).setToken(cf.token);
const slashCommands = [];
client.commands.forEach(cmd => {
    if (cmd.data) slashCommands.push(cmd.data.toJSON());
});

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(cf.clientId),
            { body: slashCommands }
        );
    } catch (error) {
        console.error(error);
    }
})();

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Komut çalıştırılırken bir hata oluştu.", ephemeral: true });
    }
});

client.on("ready", () => {
    client.user.setPresence({ status: cf.bot_status.statu, activities: [cf.bot_status.activities] });
    console.log("-------------------------------------");
    console.log("------------- Bot Aktif ---------------");
    console.log(`------------- ${client.user.username} ---------------`);
    console.log(`------------- Slash Komutlar Yüklendi! ---------------`);
    console.log(`------------- Komut Sayısı: ${client.commands.size} ---------------`);
    console.log("-------------------------------------");
});