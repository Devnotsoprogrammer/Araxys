const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Welcomes a user'),
    async execute(interaction) {
        await interaction.reply(`Welcome to the server, ${interaction.user.username}! 🎉`);
    },
    async executePrefixed(message) {
        await message.channel.send(`Welcome to the server, ${message.author.username}! 🎉`);
    },
};
