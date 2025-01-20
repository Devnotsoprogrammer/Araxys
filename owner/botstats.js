const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstats')
        .setDescription('Provides statistics about the bot.'),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        const totalServers = interaction.client.guilds.cache.size;
        const totalUsers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const embed = new EmbedBuilder()
            .setTitle('Bot Statistics')
            .addFields(
                { name: 'Uptime', value: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`, inline: true },
                { name: 'Total Servers', value: `${totalServers}`, inline: true },
                { name: 'Total Users', value: `${totalUsers}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    async executePrefixed(message) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        const totalServers = message.client.guilds.cache.size;
        const totalUsers = message.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const embed = new EmbedBuilder()
            .setTitle('Bot Statistics')
            .addFields(
                { name: 'Uptime', value: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`, inline: true },
                { name: 'Total Servers', value: `${totalServers}`, inline: true },
                { name: 'Total Users', value: `${totalUsers}`, inline: true }
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
