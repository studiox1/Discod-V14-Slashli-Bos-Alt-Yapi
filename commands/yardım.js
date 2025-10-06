const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cf = require("../config/config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yardım")
        .setDescription("Bu Komut Botun Yardım Menüsünü Gösterir!"),
        kategori: "a",
    async execute(interaction, client) {
        const Komutlar = client.commands.filter(cmd => cmd.kategori === "a");

        let komutlarListesi = Komutlar.size > 0
            ? Komutlar.map(cmd => `${cf.prefix}**${cmd.name}** **→** ${cmd.help.description}`).join("\n")
            : "Bu kategoriye ait komut bulunamadı.";

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: "https://discord.gg/3jM3vZWARx" })
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(cf.color)
            .setDescription(komutlarListesi)
            .setFooter({ text: `Kullanan: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
