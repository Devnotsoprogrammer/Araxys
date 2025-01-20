/*const { execSync } = require('child_process');

try {
    console.log('Removing old commands...');
    execSync('node remove-commands.js', { stdio: 'inherit' });

    console.log('Deploying new commands...');
    execSync('node deploy-commands.js', { stdio: 'inherit' });

    console.log('Commands refreshed successfully.');
} catch (error) {
    console.error('Error refreshing commands:', error);
}*/

// Rest of your index.js code...

const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId, guildId, prefix } = require('./config.json');
const mongoose = require('./utils/mongo.js');
const CustomCommand = require('./models/CustomCommand');
const AutoResponse = require('./models/AutoResponse');
const ServerStats = require('./models/ServerStats');
const fs = require('fs');
const express = require('express');
require('./utils/mongo');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Load owner commands
const ownerCommandFiles = fs.readdirSync('./owner').filter(file => file.endsWith('.js'));
for (const file of ownerCommandFiles) {
    const command = require(`./owner/${file}`);
    client.commands.set(command.data.name, command);
}


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.once('ready', async () => {
    console.log('Bot is online and ready to serve multiple servers!');

    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        const commands = client.commands.map(command => command.data.toJSON());
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering application commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        const customCommand = await CustomCommand.findOne({ guildId: interaction.guild.id, name: interaction.commandName });
        if (customCommand) {
            return interaction.reply(customCommand.response);
        }
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Auto responses
    const autoResponse = await AutoResponse.findOne({ guildId: message.guild.id, trigger: message.content.toLowerCase() });
    if (autoResponse) {
        return message.channel.send(autoResponse.response);
    }

    // Command handling
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) {
        const customCommand = await CustomCommand.findOne({ guildId: message.guild.id, name: commandName });
        if (customCommand) {
            return message.channel.send(customCommand.response);
        }
        return;
    }

    try {
        // Check if the command has a prefixed handler and use it
        if (command.executePrefixed) {
            await command.executePrefixed(message, args);
        } else {
            await command.execute({ message, args });
        }
    } catch (error) {
        console.error(error);
        await message.reply('There was an error executing that command!');
    }
});

client.login(token);
