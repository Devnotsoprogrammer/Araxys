const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reloadcommand')
        .setDescription('Reloads a specific command without restarting the bot.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The name of the command to reload')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const commandName = interaction.options.getString('command').toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true });
        }

        delete require.cache[require.resolve(`../commands/${commandName}.js`)];

        try {
            const newCommand = require(`../commands/${commandName}.js`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({ content: `Command \`${commandName}\` was reloaded!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``, ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide a command name to reload.');
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);

        if (!command) {
            return message.reply(`There is no command with name \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(`../commands/${commandName}.js`)];

        try {
            const newCommand = require(`../commands/${commandName}.js`);
            message.client.commands.set(newCommand.data.name, newCommand);
            await message.reply(`Command \`${commandName}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await message.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }
    },
};
