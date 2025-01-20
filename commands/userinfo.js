const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Provides information about the user')
        .addUserOption(option => 
            option.setName('target')
                  .setDescription('The user to get information about')
                  .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const userInfo = `User tag: ${user.tag}\nJoined server: ${member.joinedAt}\nAccount created: ${user.createdAt}`;
        await interaction.reply(userInfo);
    },
    async executePrefixed(message) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        const userInfo = `User tag: ${user.tag}\nJoined server: ${member.joinedAt}\nAccount created: ${user.createdAt}`;
        await message.channel.send(userInfo);
    },
};
