const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updateconfig')
        .setDescription('Updates configuration settings of the bot dynamically.')
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The configuration key to update')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('value')
                .setDescription('The new value for the configuration key')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const key = interaction.options.getString('key');
        const value = interaction.options.getString('value');
        const config = require('../config.json');

        if (!(key in config)) {
            return interaction.reply({ content: `Invalid configuration key: ${key}`, ephemeral: true });
        }

        config[key] = value;

        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        await interaction.reply({ content: `Configuration updated: ${key} = ${value}`, ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 2) {
            return message.reply('Please provide a key and value to update.');
        }

        const [key, ...valueParts] = args;
        const value = valueParts.join(' ');
        const config = require('../config.json');

        if (!(key in config)) {
            return message.reply(`Invalid configuration key: ${key}`);
        }

        config[key] = value;

        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        await message.reply(`Configuration updated: ${key} = ${value}`);
    },
};
