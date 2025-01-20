const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slow mode interval for a channel.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('The number of seconds for the slow mode')
                .setRequired(true)),

    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'I do not have permission to manage channels.', ephemeral: true });
        }

        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            interaction.reply(`Slow mode set to ${seconds} seconds.`);
        } catch (error) {
            console.error('Error setting slow mode:', error);
            interaction.reply('Failed to set slow mode. Please try again later.', { ephemeral: true });
        }
    },
};
