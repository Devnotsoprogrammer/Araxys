const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Sends a message to all servers where the bot is present.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to broadcast')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const messageContent = interaction.options.getString('message');
        let sentCount = 0;

        for (const guild of interaction.client.guilds.cache.values()) {
            const channels = guild.channels.cache.filter(channel =>
                channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
            );

            if (channels.size > 0) {
                const firstChannel = channels.first();
                try {
                    await firstChannel.send(messageContent);
                    console.log(`Message sent to ${guild.name}`);
                    sentCount++;
                } catch (error) {
                    console.error(`Could not send message to ${guild.name}:`, error);
                }
            } else {
                console.log(`No suitable channel found for ${guild.name}`);
            }
        }

        await interaction.reply({ content: `Broadcast message sent to ${sentCount} servers.`, ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const messageContent = args.join(' ');
        let sentCount = 0;

        for (const guild of message.client.guilds.cache.values()) {
            const channels = guild.channels.cache.filter(channel =>
                channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
            );

            if (channels.size > 0) {
                const firstChannel = channels.first();
                try {
                    await firstChannel.send(messageContent);
                    console.log(`Message sent to ${guild.name}`);
                    sentCount++;
                } catch (error) {
                    console.error(`Could not send message to ${guild.name}:`, error);
                }
            } else {
                console.log(`No suitable channel found for ${guild.name}`);
            }
        }

        await message.reply(`Broadcast message sent to ${sentCount} servers.`);
    },
};
