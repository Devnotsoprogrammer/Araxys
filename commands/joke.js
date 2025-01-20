const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Fetches a joke from Reddit'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://www.reddit.com/r/Jokes/top.json?limit=1&t=day');
            const joke = response.data.data.children[0].data;

            const embed = new MessageEmbed()
                .setColor('#FF4500')
                .setTitle(joke.title)
                .setDescription(joke.selftext)
                .setURL(`https://reddit.com${joke.permalink}`)
                .setFooter(`👍 ${joke.ups} | 💬 ${joke.num_comments}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to fetch a joke. Please try again later.');
        }
    },
    async executePrefixed(message) {
        try {
            const response = await axios.get('https://www.reddit.com/r/Jokes/top.json?limit=1&t=day');
            const joke = response.data.data.children[0].data;

            const embed = new MessageEmbed()
                .setColor('#FF4500')
                .setTitle(joke.title)
                .setDescription(joke.selftext)
                .setURL(`https://reddit.com${joke.permalink}`)
                .setFooter(`👍 ${joke.ups} | 💬 ${joke.num_comments}`);

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.channel.send('Failed to fetch a joke. Please try again later.');
        }
    },
};
