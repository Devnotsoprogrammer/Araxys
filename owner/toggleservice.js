const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

const services = {
    welcome: { enabled: true },
    logging: { enabled: true },
    moderation: { enabled: true },
    // Add more services as needed
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleservice')
        .setDescription('Enables or disables specific services or features of the bot.')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('The service to toggle')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('state')
                .setDescription('Enable or disable the service')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const service = interaction.options.getString('service').toLowerCase();
        const state = interaction.options.getBoolean('state');

        if (!(service in services)) {
            return interaction.reply({ content: `Invalid service: ${service}`, ephemeral: true });
        }

        services[service].enabled = state;
        await interaction.reply({ content: `Service ${service} has been ${state ? 'enabled' : 'disabled'}.`, ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 2) {
            return message.reply('Please provide a service and state to toggle.');
        }

        const [service, stateString] = args;
        const state = stateString.toLowerCase() === 'true';

        if (!(service in services)) {
            return message.reply(`Invalid service: ${service}`);
        }

        services[service].enabled = state;
        await message.reply(`Service ${service} has been ${state ? 'enabled' : 'disabled'}.`);
    },
};
