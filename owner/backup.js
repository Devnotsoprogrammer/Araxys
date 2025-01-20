const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Creates a backup of the bot\'s data and configuration settings.'),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const backupFilePath = path.join(__dirname, '..', 'backup', `backup-${Date.now()}.json`);
        
        const data = {
            config: require('../config.json'),
            // Include any additional data that needs to be backed up
        };

        fs.mkdir(path.join(__dirname, '..', 'backup'), { recursive: true }, (err) => {
            if (err) {
                console.error('Failed to create backup directory:', err);
                return interaction.reply({ content: 'Failed to create backup directory.', ephemeral: true });
            }

            fs.writeFile(backupFilePath, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.error('Failed to create backup file:', err);
                    return interaction.reply({ content: 'Failed to create backup file.', ephemeral: true });
                }

                interaction.reply({ content: `Backup created successfully at ${backupFilePath}`, ephemeral: true });
            });
        });
    },

    async executePrefixed(message) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const backupFilePath = path.join(__dirname, '..', 'backup', `backup-${Date.now()}.json`);
        
        const data = {
            config: require('../config.json'),
            // Include any additional data that needs to be backed up
        };

        fs.mkdir(path.join(__dirname, '..', 'backup'), { recursive: true }, (err) => {
            if (err) {
                console.error('Failed to create backup directory:', err);
                return message.reply('Failed to create backup directory.');
            }

            fs.writeFile(backupFilePath, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.error('Failed to create backup file:', err);
                    return message.reply('Failed to create backup file.');
                }

                message.reply(`Backup created successfully at ${backupFilePath}`);
            });
        });
    },
};
