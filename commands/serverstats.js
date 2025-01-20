const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ServerStats = require('../models/ServerStats');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Displays server statistics'),
    async execute(interaction) {
        const { guild } = interaction;
        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
        const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
        const creationDate = guild.createdAt.toDateString();

        const serverStats = await ServerStats.findOne({ guildId: guild.id }) || { messages: 0 };

        const embed = new MessageEmbed()
            .setTitle(`Server Stats for ${guild.name}`)
            .addField('Total Members', totalMembers.toString(), true)
            .addField('Online Members', onlineMembers.toString(), true)
            .addField('Text Channels', textChannels.toString(), true)
            .addField('Voice Channels', voiceChannels.toString(), true)
            .addField('Creation Date', creationDate, false)
            .addField('Total Messages', serverStats.messages.toString(), true)
            .setColor('#00AAFF');

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefixed(message) {
        const { guild } = message;
        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
        const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
        const creationDate = guild.createdAt.toDateString();

        const serverStats = await ServerStats.findOne({ guildId: guild.id }) || { messages: 0 };

        const embed = new MessageEmbed()
            .setTitle(`Server Stats for ${guild.name}`)
            .addField('Total Members', totalMembers.toString(), true)
            .addField('Online Members', onlineMembers.toString(), true)
            .addField('Text Channels', textChannels.toString(), true)
            .addField('Voice Channels', voiceChannels.toString(), true)
            .addField('Creation Date', creationDate, false)
            .addField('Total Messages', serverStats.messages.toString(), true)
            .setColor('#00AAFF');

        await message.channel.send({ embeds: [embed] });
    },
};
