const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Sends the bot invite link and support server link.'),
    
    async execute(interaction) {
        const botInviteUrl = 'https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=YOUR_PERMISSIONS&scope=bot';
        const supportServerUrl = 'https://discord.gg/YOUR_SUPPORT_SERVER_INVITE';

        const inviteButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL(supportServerUrl),
                new ButtonBuilder()
                    .setLabel('Bot Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(botInviteUrl)
            );

        await interaction.reply({ content: 'Here are the invite links:', components: [inviteButtons] });
    },

    async executePrefixed(message) {
        const botInviteUrl = 'https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=YOUR_PERMISSIONS&scope=bot';
        const supportServerUrl = 'https://discord.gg/YOUR_SUPPORT_SERVER_INVITE';

        const inviteButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Support Server')
                    .setStyle('LINK')
                    .setURL(supportServerUrl),
                new MessageButton()
                    .setLabel('Bot Invite')
                    .setStyle('LINK')
                    .setURL(botInviteUrl)
            );

        await message.channel.send({ content: 'Here are the invite links:', components: [inviteButtons] });
    },
};
