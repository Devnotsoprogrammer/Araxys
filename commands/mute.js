const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member in the server')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to mute')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                  .setDescription('Reason for muting')
                  .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) return interaction.reply({ content: 'No "Muted" role found. Please create one.', ephemeral: true });

        if (member.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: 'This user is already muted.', ephemeral: true });
        }

        await member.roles.add(muteRole, reason);
        await interaction.reply(`Muted ${member.user.tag} for: ${reason}`);
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('You do not have permissions to mute members!');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to specify a user!');

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) return message.reply('No "Muted" role found. Please create one.');

        if (member.roles.cache.has(muteRole.id)) {
            return message.reply('This user is already muted.');
        }

        await member.roles.add(muteRole, reason);
        await message.reply(`Muted ${user.tag} for: ${reason}`);
    },
};
