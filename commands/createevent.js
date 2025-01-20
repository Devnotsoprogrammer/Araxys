const { SlashCommandBuilder } = require('@discordjs/builders');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createevent')
        .setDescription('Create an event with a reminder')
        .addStringOption(option => 
            option.setName('eventname')
                  .setDescription('The name of the event')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('date')
                  .setDescription('The date and time of the event (YYYY-MM-DD HH:MM)')
                  .setRequired(true)),
    async execute(interaction) {
        const eventName = interaction.options.getString('eventname');
        const date = interaction.options.getString('date');

        const job = schedule.scheduleJob(new Date(date), function() {
            interaction.channel.send(`Reminder: The event "${eventName}" is happening now!`);
        });

        await interaction.reply({ content: `Event "${eventName}" scheduled for ${date}.`, ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_EVENTS')) {
            return message.reply('You do not have permissions to create events!');
        }

        const eventName = args[0];
        const date = args.slice(1).join(' ');

        if (!eventName || !date) return message.reply('You need to specify an event name and date/time!');

        const job = schedule.scheduleJob(new Date(date), function() {
            message.channel.send(`Reminder: The event "${eventName}" is happening now!`);
        });

        await message.reply(`Event "${eventName}" scheduled for ${date}.`);
    },
};
