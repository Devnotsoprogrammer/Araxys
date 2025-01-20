const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restore')
        .setDescription('Restores the bot\'s data and configuration settings from a backup file.')
        .addStringOption(option =>
            option.setName('filename')
                .setDescription('The name of the backup file to restore from')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const filename = interaction.options.getString('filename');
        const backupFilePath = path.join(__dirname, '..', 'backup', filename);

        try {
            if (!fs.existsSync(backupFilePath)) {
                return interaction.reply({ content: `Backup file ${filename} does not exist.`, ephemeral: true });
            }

            const data = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
            fs.writeFileSync('./config.json', JSON.stringify(data.config, null, 2));
            // Restore any additional data as needed

            interaction.reply({ content: `Successfully restored from ${filename}.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to restore from backup file:', error);
            interaction.reply({ content: 'Failed to restore from backup file.', ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide the name of the backup file to restore from.');
        }

        const filename = args[0];
        const backupFilePath = path.join(__dirname, '..', 'backup', filename);

        try {
            if (!fs.existsSync(backupFilePath)) {
                return message.reply(`Backup file ${filename} does not exist.`);
            }

            const data = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
            fs.writeFileSync('./config.json', JSON.stringify(data.config, null, 2));
            // Restore any additional data as needed

            message.reply(`Successfully restored from ${filename}.`);
        } catch (error) {
            console.error('Failed to restore from backup file:', error);
            message.reply('Failed to restore from backup file.');
        }
    },
};
