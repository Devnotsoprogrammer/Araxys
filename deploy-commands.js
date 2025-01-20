const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('Command files:', commandFiles);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        console.log(`Loading command: ${command.data.name}`);
        commands.push(command.data.toJSON());
    } else {
        console.warn(`Command file ${file} does not have a valid command data structure.`);
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands globally.');

        await rest.put(
            Routes.applicationCommands(clientId), // Registering globally
            { body: commands }
        );

        console.log('Successfully reloaded all global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
