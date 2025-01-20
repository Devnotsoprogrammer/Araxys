const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to kick')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                  .setDescription('Reason for kicking')
                  .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
        }

        await member.kick(reason);
        await interaction.reply(`Kicked ${member.user.tag} for: ${reason}`);
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to kick members!');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to specify a user!');

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member.kickable) {
            return message.reply('I cannot kick this user.');
        }

        await member.kick(reason);
        await message.reply(`Kicked ${user.tag} for: ${reason}`);
    },
};
