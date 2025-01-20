const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userstats')
        .setDescription('Provides detailed statistics about a specific user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get statistics for')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Statistics for ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Username', value: user.username, inline: true },
                { name: 'Discriminator', value: user.discriminator, inline: true },
                { name: 'Joined Server', value: new Date(member.joinedTimestamp).toLocaleString(), inline: true },
                { name: 'Joined Discord', value: new Date(user.createdTimestamp).toLocaleString(), inline: true },
                { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true }
            )
            .setColor('#00FFFF')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide a user to get statistics for.');
        }

        const userId = args[0].replace(/[<@!>]/g, '');
        const user = await message.client.users.fetch(userId);
        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return message.reply('User not found in this server.');
        }

        const embed = new EmbedBuilder()
            .setTitle(`Statistics for ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Username', value: user.username, inline: true },
                { name: 'Discriminator', value: user.discriminator, inline: true },
                { name: 'Joined Server', value: new Date(member.joinedTimestamp).toLocaleString(), inline: true },
                { name: 'Joined Discord', value: new Date(user.createdTimestamp).toLocaleString(), inline: true },
                { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true }
            )
            .setColor('BLUE')
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
