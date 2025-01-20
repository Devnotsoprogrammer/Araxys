const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member from the server')
        .addStringOption(option => 
            option.setName('user')
                  .setDescription('The ID of the user to unban')
                  .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permissions to unban members!', ephemeral: true });
        }

        const userId = interaction.options.getString('user');
        const guild = interaction.guild;

        try {
            const user = await guild.members.unban(userId);
            await interaction.reply(`Unbanned ${user.tag}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while trying to unban this user.', ephemeral: true });
        }
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You do not have permissions to unban members!');
        }

        const userId = args[0];
        if (!userId) return message.reply('You need to specify a user ID!');

        try {
            const user = await message.guild.members.unban(userId);
            await message.reply(`Unbanned ${user.tag}`);
        } catch (error) {
            console.error(error);
            await message.reply('An error occurred while trying to unban this user.');
        }
    },
};
