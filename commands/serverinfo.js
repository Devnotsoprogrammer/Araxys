const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Provides information about the server'),
    async execute(interaction) {
        const { guild } = interaction;
        const serverInfo = `Server name: ${guild.name}\nTotal members: ${guild.memberCount}\nCreated at: ${guild.createdAt}\nServer region: ${guild.region}`;
        await interaction.reply(serverInfo);
    },
    async executePrefixed(message) {
        const { guild } = message;
        const serverInfo = `Server name: ${guild.name}\nTotal members: ${guild.memberCount}\nCreated at: ${guild.createdAt}\nServer region: ${guild.region}`;
        await message.channel.send(serverInfo);
    },
};
