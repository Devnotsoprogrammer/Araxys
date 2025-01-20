const { SlashCommandBuilder } = require('@discordjs/builders');
const CustomCommand = require('../models/CustomCommand');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcommand')
        .setDescription('Add a custom command')
        .addStringOption(option => 
            option.setName('name')
                  .setDescription('The name of the custom command')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('response')
                  .setDescription('The response of the custom command')
                  .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const response = interaction.options.getString('response');

        const existingCommand = await CustomCommand.findOne({ guildId: interaction.guild.id, name });
        if (existingCommand) {
            return interaction.reply({ content: 'A command with this name already exists.', ephemeral: true });
        }

        const customCommand = new CustomCommand({ guildId: interaction.guild.id, name, response });
        await customCommand.save();

        await interaction.reply({ content: `Custom command \`${name}\` added successfully!`, ephemeral: true });
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permissions to add custom commands!');
        }

        const name = args[0];
        const response = args.slice(1).join(' ');

        if (!name || !response) return message.reply('You need to specify a name and response for the custom command!');

        const existingCommand = await CustomCommand.findOne({ guildId: message.guild.id, name });
        if (existingCommand) {
            return message.reply('A command with this name already exists.');
        }

        const customCommand = new CustomCommand({ guildId: message.guild.id, name, response });
        await customCommand.save();

        await message.reply(`Custom command \`${name}\` added successfully!`);
    },
};
