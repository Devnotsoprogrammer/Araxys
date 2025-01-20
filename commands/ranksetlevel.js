const { SlashCommandBuilder } = require('discord.js');
const { Rank, levelRoles, checkForRoleUpdate } = require('../utils/mongo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranksetlevel')
        .setDescription('Set the level of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to set the level for')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The level to set')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level');
        const userId = user.id;
        const userName = user.tag;

        if (level < 1 || level > 100) {
            return interaction.reply('Level must be between 1 and 100.');
        }

        let userRank = await Rank.findOne({ userId });

        if (!userRank) {
            userRank = new Rank({ userId, userName, rank: level, xp: 0 });
        } else {
            userRank.rank = level;
        }

        await userRank.save();

        await interaction.reply(`Set level of **${userName}** to **${level}**.`);

        await checkForRoleUpdate(interaction.guild, user, level);
    },
};
