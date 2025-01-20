const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pardon')
        .setDescription('Unbans a user from all servers where the bot has administrative access.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unban')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        let unbanCount = 0;

        for (const guild of interaction.client.guilds.cache.values()) {
            if (guild.members.me.permissions.has('BAN_MEMBERS')) {
                await guild.members.unban(user.id)
                    .then(() => {
                        console.log(`Unbanned ${user.tag} from ${guild.name}`);
                        unbanCount++;
                    })
                    .catch(error => console.error(`Failed to unban ${user.tag} from ${guild.name}:`, error));
            }
        }

        await interaction.reply({ content: `User ${user.tag} has been unbanned from ${unbanCount} servers.`, ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide a user to unban.');
        }

        const userId = args[0].replace(/[<@!>]/g, '');
        const user = await message.client.users.fetch(userId);

        if (!user) {
            return message.reply('User not found.');
        }

        let unbanCount = 0;

        for (const guild of message.client.guilds.cache.values()) {
            if (guild.members.me.permissions.has('BAN_MEMBERS')) {
                await guild.members.unban(user.id)
                    .then(() => {
                        console.log(`Unbanned ${user.tag} from ${guild.name}`);
                        unbanCount++;
                    })
                    .catch(error => console.error(`Failed to unban ${user.tag} from ${guild.name}:`, error));
            }
        }

        await message.reply(`User ${user.tag} has been unbanned from ${unbanCount} servers.`);
    },
};
