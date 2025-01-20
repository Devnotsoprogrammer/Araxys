const { SlashCommandBuilder } = require('@discordjs/builders');
const AutoResponse = require('../models/AutoResponse');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeresponse')
        .setDescription('Remove an automated response')
        .addStringOption(option => 
            option.setName('trigger')
                  .setDescription('The trigger phrase')
                  .setRequired(true)),
    async execute(interaction) {
        const trigger = interaction.options.getString('trigger').toLowerCase();

        const autoResponse = await AutoResponse.findOneAndDelete({ guildId: interaction.guild.id, trigger });
        if (!autoResponse) {
            return interaction.reply({ content: 'No response found for this trigger.', ephemeral: true });
        }

        await interaction.reply({ content: `Auto-response for \`${trigger}\` removed successfully!`, ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permissions to remove automated responses!');
        }

        const trigger = args[0].toLowerCase();
        if (!trigger) return message.reply('You need to specify the trigger phrase of the response to remove!');

        const autoResponse = await AutoResponse.findOneAndDelete({ guildId: message.guild.id, trigger });
        if (!autoResponse) {
            return message.reply('No response found for this trigger.');
        }

        await message.reply(`Auto-response for \`${trigger}\` removed successfully!`);
    },
};
