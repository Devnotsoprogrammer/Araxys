const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a number of messages from a channel.')
    .addIntegerOption(option => 
      option.setName('count')
        .setDescription('Number of messages to delete')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MANAGE_MESSAGES)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const count = interaction.options.getInteger('count');
    if (count < 1 || count > 100) {
      return interaction.reply({ content: 'Please provide a number between 1 and 100.', ephemeral: true });
    }

    try {
      await interaction.channel.bulkDelete(count, true);
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setDescription(`Successfully deleted ${count} message(s).`)
        .setTimestamp();
        
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
    }
  },

  async executePrefixed(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MANAGE_MESSAGES)) {
      return message.reply('You do not have permission to use this command.');
    }

    if (args.length === 0) {
      return message.reply('Please specify the number of messages to delete.');
    }

    const count = parseInt(args[0], 10);
    if (isNaN(count) || count < 1 || count > 100) {
      return message.reply('Please provide a number between 1 and 100.');
    }

    try {
      await message.channel.bulkDelete(count, true);
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setDescription(`Successfully deleted ${count} message(s).`)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return message.reply('There was an error trying to purge messages in this channel!');
    }
  }
};
