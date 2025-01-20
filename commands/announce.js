const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement')
        .addStringOption(option => 
            option.setName('message')
                  .setDescription('The announcement message')
                  .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('The channel to send the announcement in')
                  .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel');

        channel.send(message);
        await interaction.reply({ content: 'Announcement sent!', ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permissions to send announcements!');
        }

        const announcementChannel = message.mentions.channels.first();
        if (!announcementChannel) return message.reply('You need to specify a channel!');

        const announcementMessage = args.slice(1).join(' ');
        if (!announcementMessage) return message.reply('You need to specify a message!');

        announcementChannel.send(announcementMessage);
        await message.reply('Announcement sent!');
    },
};
