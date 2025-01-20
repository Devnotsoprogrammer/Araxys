const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  warnings: { type: Number, default: 0 },
});

const Warn = mongoose.model('Warn', warnSchema);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Manage warnings for users')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a warning from a user')
        .addUserOption(option => option.setName('user').setDescription('The user to remove a warning from').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List warnings for a user')
        .addUserOption(option => option.setName('user').setDescription('The user to list warnings for').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option => option.setName('user').setDescription('The user to clear warnings for').setRequired(true))),

  async execute(interaction) {
    if (!interaction.member.permissions.has([
      PermissionsBitField.Flags.MANAGE_MESSAGES,
      PermissionsBitField.Flags.MANAGE_ROLES,
      PermissionsBitField.Flags.BAN_MEMBERS,
      PermissionsBitField.Flags.KICK_MEMBERS
    ])) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    const userId = user.id;

    if (subcommand === 'add') {
      let warnData = await Warn.findOne({ guildId, userId });
      if (!warnData) {
        warnData = new Warn({ guildId, userId });
      }
      warnData.warnings += 1;
      await warnData.save();

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Warning Added')
        .setDescription(`${user.tag} has been warned.`)
        .addFields({ name: 'Total Warnings', value: `${warnData.warnings}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'remove') {
      let warnData = await Warn.findOne({ guildId, userId });
      if (!warnData || warnData.warnings === 0) {
        return interaction.reply(`${user.tag} has no warnings.`);
      }
      warnData.warnings -= 1;
      await warnData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Warning Removed')
        .setDescription(`A warning has been removed from ${user.tag}.`)
        .addFields({ name: 'Total Warnings', value: `${warnData.warnings}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'list') {
      const warnData = await Warn.findOne({ guildId, userId });

      const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Warning List')
        .setDescription(`${user.tag} has ${warnData ? warnData.warnings : 0} warning(s).`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'clear') {
      await Warn.deleteOne({ guildId, userId });

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Warnings Cleared')
        .setDescription(`All warnings for ${user.tag} have been cleared.`)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  },

  async executePrefixed(message, args) {
    if (!message.member.permissions.has([
      PermissionsBitField.Flags.MANAGE_MESSAGES,
      PermissionsBitField.Flags.MANAGE_ROLES,
      PermissionsBitField.Flags.BAN_MEMBERS,
      PermissionsBitField.Flags.KICK_MEMBERS
    ])) {
      return message.reply('You do not have permission to use this command.');
    }

    if (args.length < 2) {
      return message.reply('Please use the correct format: `!warn add @user`, `!warn remove @user`, `!warn list @user`, or `!warn clear @user`.');
    }

    const subcommand = args[0];
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('You need to mention a user!');
    }

    const guildId = message.guild.id;
    const userId = user.id;

    if (subcommand === 'add') {
      let warnData = await Warn.findOne({ guildId, userId });
      if (!warnData) {
        warnData = new Warn({ guildId, userId });
      }
      warnData.warnings += 1;
      await warnData.save();

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Warning Added')
        .setDescription(`${user.tag} has been warned.`)
        .addFields({ name: 'Total Warnings', value: `${warnData.warnings}` })
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } else if (subcommand === 'remove') {
      let warnData = await Warn.findOne({ guildId, userId });
      if (!warnData || warnData.warnings === 0) {
        return message.reply(`${user.tag} has no warnings.`);
      }
      warnData.warnings -= 1;
      await warnData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Warning Removed')
        .setDescription(`A warning has been removed from ${user.tag}.`)
        .addFields({ name: 'Total Warnings', value: `${warnData.warnings}` })
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } else if (subcommand === 'list') {
      const warnData = await Warn.findOne({ guildId, userId });

      const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Warning List')
        .setDescription(`${user.tag} has ${warnData ? warnData.warnings : 0} warning(s).`)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } else if (subcommand === 'clear') {
      await Warn.deleteOne({ guildId, userId });

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Warnings Cleared')
        .setDescription(`All warnings for ${user.tag} have been cleared.`)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } else {
      return message.reply('Invalid subcommand! Please use `!warn add @user`, `!warn remove @user`, `!warn list @user`, or `!warn clear @user`.');
    }
  }
};
