const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaveserver')
        .setDescription('Makes the bot leave a specified server.')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server to leave')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const serverId = interaction.options.getString('serverid');
        const guild = interaction.client.guilds.cache.get(serverId);

        if (!guild) {
            return interaction.reply({ content: `No server found with ID: ${serverId}`, ephemeral: true });
        }

        try {
            await guild.leave();
            await interaction.reply({ content: `Successfully left the server: ${guild.name}`, ephemeral: true });
        } catch (error) {
            console.error(`Failed to leave the server ${guild.name}:`, error);
            await interaction.reply({ content: 'Failed to leave the server. Please check the bot\'s permissions and try again.', ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const serverId = args[0];
        const guild = message.client.guilds.cache.get(serverId);

        if (!guild) {
            return message.reply(`No server found with ID: ${serverId}`);
        }

        try {
            await guild.leave();
            await message.reply(`Successfully left the server: ${guild.name}`);
        } catch (error) {
            console.error(`Failed to leave the server ${guild.name}:`, error);
            await message.reply('Failed to leave the server. Please check the bot\'s permissions and try again.');
        }
    },
};
