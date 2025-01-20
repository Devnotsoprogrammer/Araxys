const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ownerhelp')
        .setDescription('Displays a list of commands available only to the bot owners.'),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Owner Commands')
            .setDescription(`
                **/botstats**: Provides statistics about the bot.
                **/broadcast**: Sends a message to all servers.
                **/leaveserver**: Makes the bot leave a specified server.
                **/userstats**: Provides detailed statistics about a specific user.
                **/updateconfig**: Allows owners to update configuration settings.
                **/toggleservice**: Enables or disables specific bot features.
                **/eval**: Executes code snippets for debugging.
                **/ownerhelp**: Displays a list of commands for owners.
                **/reloadcommand**: Reloads a specific command.
                **/checkpermissions**: Checks bot permissions in all servers.
                **/ban**: Bans a user from all servers with admin access.
                **/unban**: Unbans a user from all servers with admin access.
                **/backup**: Creates a backup of data and configurations.
                **/restore**: Restores data and configurations from a backup.
            `)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    async executePrefixed(message) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Owner Commands')
            .setDescription(`
                **!botstats**: Provides statistics about the bot.
                **!broadcast**: Sends a message to all servers.
                **!leaveserver**: Makes the bot leave a specified server.
                **!userstats**: Provides detailed statistics about a specific user.
                **!updateconfig**: Allows owners to update configuration settings.
                **!toggleservice**: Enables or disables specific bot features.
                **!eval**: Executes code snippets for debugging.
                **!ownerhelp**: Displays a list of commands for owners.
                **!reloadcommand**: Reloads a specific command.
                **!checkpermissions**: Checks bot permissions in all servers.
                **!ban**: Bans a user from all servers with admin access.
                **!unban**: Unbans a user from all servers with admin access.
                **!backup**: Creates a backup of data and configurations.
                **!restore**: Restores data and configurations from a backup.
            `)
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
