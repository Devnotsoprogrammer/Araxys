const { SlashCommandBuilder } = require('discord.js');
const { Rank } = require('../utils/mongo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rankview')
        .setDescription('View your rank or the rank of another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to view the rank of')),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const userId = user.id;
        const userName = user.tag;

        let userRank = await Rank.findOne({ userId });

        if (!userRank) {
            userRank = new Rank({ userId, userName, rank: 1, xp: 0 });
            await userRank.save();
        }

        await interaction.reply(`**${userName}**\nRank: **${userRank.rank}**\nXP: **${userRank.xp}**`);
    },
};
