const { SlashCommandBuilder } = require('@discordjs/builders');
const CustomCommand = require('../models/CustomCommand');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecommand')
        .setDescription('Remove a custom command')
        .addStringOption(option => 
            option.setName('name')
                  .setDescription('The name of the custom command')
                  .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        const customCommand = await CustomCommand.findOneAndDelete({ guildId: interaction.guild.id, name });
        if (!customCommand) {
            return interaction.reply({ content: 'No command found with this name.', ephemeral: true });
        }

        await interaction.reply({ content: `Custom command \`${name}\` removed successfully!`, ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permissions to remove custom commands!');
        }

        const name = args[0];
        if (!name) return message.reply('You need to specify the name of the custom command!');

        const customCommand = await CustomCommand.findOneAndDelete({ guildId: message.guild.id, name });
        if (!customCommand) {
            return message.reply('No command found with this name.');
        }

        await message.reply(`Custom command \`${name}\` removed successfully!`);
    },
};
