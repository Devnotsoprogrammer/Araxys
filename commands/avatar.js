const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of the specified user or your own avatar.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user\'s avatar to show')
                .setRequired(false)),
    
    async execute(interaction) {
        // Handle slash command
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [avatarEmbed] });
    },

    async executePrefixed(message, args) {
        // Handle prefixed command
        let user;
        if (args.length > 0) {
            // Try to get mentioned user or use the provided username
            user = message.mentions.users.first() || message.guild.members.cache.find(member => member.user.username === args[0])?.user;
        }

        // Fallback to the message author if no user was found or provided
        user = user || message.author;

        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        await message.channel.send({ embeds: [avatarEmbed] });
    },
};
