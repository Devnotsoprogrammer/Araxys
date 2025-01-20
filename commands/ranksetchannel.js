const { SlashCommandBuilder } = require('discord.js');
const { RankUpdateChannel } = require('../utils/mongo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranksetchannel')
        .setDescription('Set the channel for rank updates')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to post rank updates in')
                .setRequired(true)),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const serverId = interaction.guild.id;

        await RankUpdateChannel.findOneAndUpdate(
            { serverId },
            { channelId: channel.id },
            { upsert: true }
        );

        await interaction.reply(`Rank update channel set to ${channel.name}.`);
    },
};
