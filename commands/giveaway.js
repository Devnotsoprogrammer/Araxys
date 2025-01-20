const { SlashCommandBuilder } = require('discord.js');
const { Giveaway } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Starts a new giveaway')
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('The prize of the giveaway')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('winners')
                .setDescription('The number of winners')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the giveaway in minutes')
                .setRequired(true)),

    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const winnersCount = interaction.options.getInteger('winners');
        const duration = interaction.options.getInteger('duration');

        const endTime = new Date(Date.now() + duration * 60000); // Convert minutes to milliseconds

        const giveawayMessage = await interaction.reply({
            content: `🎉 **GIVEAWAY** 🎉\nPrize: **${prize}**\nWinners: **${winnersCount}**\nReact with 🎉 to participate!\nEnds: <t:${Math.floor(endTime / 1000)}:R>`,
            fetchReply: true
        });

        await giveawayMessage.react('🎉');

        // Save the giveaway to the database
        const newGiveaway = new Giveaway({
            channelId: interaction.channel.id,
            messageId: giveawayMessage.id,
            prize,
            winnersCount,
            endTime,
            ended: false,
            participants: []
        });
        await newGiveaway.save();

        // Schedule the giveaway end
        setTimeout(async () => {
            const updatedGiveaway = await Giveaway.findOne({ messageId: giveawayMessage.id });
            if (!updatedGiveaway || updatedGiveaway.ended) return;

            const reactions = giveawayMessage.reactions.cache.get('🎉');
            if (!reactions) return;

            const participants = await reactions.users.fetch();
            updatedGiveaway.participants = participants.map(user => user.id).filter(id => id !== interaction.client.user.id);
            updatedGiveaway.ended = true;

            await updatedGiveaway.save();

            if (updatedGiveaway.participants.length < winnersCount) {
                return interaction.followUp(`Not enough participants for the giveaway of **${prize}**.`);
            }

            const winners = [];
            for (let i = 0; i < winnersCount; i++) {
                const winner = updatedGiveaway.participants.splice(Math.floor(Math.random() * updatedGiveaway.participants.length), 1)[0];
                winners.push(`<@${winner}>`);
            }

            interaction.followUp(`🎉 **GIVEAWAY ENDED** 🎉\nPrize: **${prize}**\nWinners: ${winners.join(', ')}`);
        }, duration * 60000); // Convert minutes to milliseconds
    },
};
