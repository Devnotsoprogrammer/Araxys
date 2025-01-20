const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('Pong! 🏓')
      .setDescription('Latency test is a success!')
      .addFields({ name: 'Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  async executePrefixed(message) {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('Pong! 🏓')
      .setDescription('Latency test is a success!')
      .addFields({ name: 'Latency', value: `${Date.now() - message.createdTimestamp}ms`, inline: true })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
