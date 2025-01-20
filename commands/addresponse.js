const { SlashCommandBuilder } = require('@discordjs/builders');
const AutoResponse = require('../models/AutoResponse');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addresponse')
        .setDescription('Add an automated response')
        .addStringOption(option => 
            option.setName('trigger')
                  .setDescription('The trigger phrase')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('response')
                  .setDescription('The response message')
                  .setRequired(true)),
    async execute(interaction) {
        const trigger = interaction.options.getString('trigger').toLowerCase();
        const response = interaction.options.getString('response');

        const existingResponse = await AutoResponse.findOne({ guildId: interaction.guild.id, trigger });
        if (existingResponse) {
            return interaction.reply({ content: 'A response for this trigger already exists.', ephemeral: true });
        }

        const autoResponse = new AutoResponse({ guildId: interaction.guild.id, trigger, response });
        await autoResponse.save();

        await interaction.reply({ content: `Auto-response for \`${trigger}\` added successfully!`, ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permissions to add automated responses!');
        }

        const trigger = args[0].toLowerCase();
        const response = args.slice(1).join(' ');

        if (!trigger || !response) return message.reply('You need to specify a trigger phrase and response message!');

        const existingResponse = await AutoResponse.findOne({ guildId: message.guild.id, trigger });
        if (existingResponse) {
            return message.reply('A response for this trigger already exists.');
        }

        const autoResponse = new AutoResponse({ guildId: message.guild.id, trigger, response });
        await autoResponse.save();

        await message.reply(`Auto-response for \`${trigger}\` added successfully!`);
    },
};
