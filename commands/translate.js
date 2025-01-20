const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { googleApiKey } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translates text from one language to another.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('The source language code (e.g., en for English)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('The target language code (e.g., es for Spanish)')
                .setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');

        try {
            const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
                params: {
                    q: text,
                    source: from,
                    target: to,
                    key: googleApiKey,
                }
            });

            const translatedText = response.data.data.translations[0].translatedText;
            await interaction.reply(`Translated from ${from} to ${to}: ${translatedText}`);
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply('An error occurred while trying to translate the text. Please try again later.', { ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (args.length < 3) {
            return message.reply('Please provide text, source language code, and target language code.');
        }

        const text = args.slice(0, args.length - 2).join(' ');
        const from = args[args.length - 2];
        const to = args[args.length - 1];

        try {
            const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
                params: {
                    q: text,
                    source: from,
                    target: to,
                    key: googleApiKey,
                }
            });

            const translatedText = response.data.data.translations[0].translatedText;
            await message.reply(`Translated from ${from} to ${to}: ${translatedText}`);
        } catch (error) {
            console.error('Translation error:', error);
            await message.reply('An error occurred while trying to translate the text. Please try again later.');
        }
    },
};
