const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started removing all application (/) commands.');

        // Fetch all global commands
        const commands = await rest.get(Routes.applicationCommands(clientId));
        console.log('Fetched Commands:', commands);

        // Delete each command
        for (const command of commands) {
            await rest.delete(Routes.applicationCommand(clientId, command.id));
            console.log(`Deleted command: ${command.name}`);
        }

        console.log('Successfully removed all application (/) commands.');
    } catch (error) {
        console.error('Error removing application (/) commands:', error);
    }
})();
