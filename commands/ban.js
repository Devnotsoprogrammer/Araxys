const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to ban')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                  .setDescription('Reason for banning')
                  .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permissions to ban members!', ephemeral: true });
        }

        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
        }

        await member.ban({ reason });
        await interaction.reply(`Banned ${member.user.tag} for: ${reason}`);
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You do not have permissions to ban members!');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to specify a user!');

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member.bannable) {
            return message.reply('I cannot ban this user.');
        }

        await member.ban({ reason });
        await message.reply(`Banned ${user.tag} for: ${reason}`);
    },
};
