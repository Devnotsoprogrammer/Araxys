const { SlashCommandBuilder } = require('@discordjs/builders');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedule an announcement')
        .addStringOption(option => 
            option.setName('message')
                  .setDescription('The announcement message')
                  .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('The channel to send the announcement in')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('time')
                  .setDescription('The time to send the announcement (YYYY-MM-DD HH:MM)')
                  .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel');
        const time = interaction.options.getString('time');

        const job = schedule.scheduleJob(new Date(time), function() {
            channel.send(message);
        });

        await interaction.reply({ content: 'Announcement scheduled!', ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permissions to schedule announcements!');
        }

        const announcementChannel = message.mentions.channels.first();
        if (!announcementChannel) return message.reply('You need to specify a channel!');

        const announcementTime = args[0];
        const announcementMessage = args.slice(1).join(' ');
        if (!announcementTime || !announcementMessage) return message.reply('You need to specify a time and message!');

        const job = schedule.scheduleJob(new Date(announcementTime), function() {
            announcementChannel.send(announcementMessage);
        });

        await message.reply('Announcement scheduled!');
    },
};
