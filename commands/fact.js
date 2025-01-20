const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Fetches a fact from Reddit'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://www.reddit.com/r/todayilearned/top.json?limit=1&t=day');
            const fact = response.data.data.children[0].data;

            const embed = new MessageEmbed()
                .setColor('#00AAFF')
                .setTitle(fact.title)
                .setDescription(fact.selftext || fact.title)  // Some facts may not have a selftext
                .setURL(`https://reddit.com${fact.permalink}`)
                .setFooter(`👍 ${fact.ups} | 💬 ${fact.num_comments}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to fetch a fact. Please try again later.');
        }
    },
    async executePrefixed(message) {
        try {
            const response = await axios.get('https://www.reddit.com/r/todayilearned/top.json?limit=1&t=day');
            const fact = response.data.data.children[0].data;

            const embed = new MessageEmbed()
                .setColor('#00AAFF')
                .setTitle(fact.title)
                .setDescription(fact.selftext || fact.title)  // Some facts may not have a selftext
                .setURL(`https://reddit.com${fact.permalink}`)
                .setFooter(`👍 ${fact.ups} | 💬 ${fact.num_comments}`);

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.channel.send('Failed to fetch a fact. Please try again later.');
        }
    },
};
