const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hellban')
        .setDescription('Bans a user from all servers where the bot has administrative access.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        let banCount = 0;

        for (const guild of interaction.client.guilds.cache.values()) {
            try {
                const member =  guild.members.cache.get(user.id) ? guild.members.cache.get(user.id) : await guild.members.fetch(user.id);
                if (member && member.banable && guild.members.me.permissions.has('BAN_MEMBERS')) {
                    await member.ban({ reason : reason });
                    console.log(`Banned ${user.tag} from ${guild.name} for: ${reason}`);
                    banCount++;
                } else if (guild.members.me.permissions.has('BAN_MEMBERS')) {
                    await guild.members.ban(user.id, { reason : reason });
                    console.log(`Banned ${user.tag} from ${guild.name} for: ${reason}`);
                    banCount++;
                }
            } catch (error) {
                console.error(`Failed to ban ${user.tag} from ${guild.name}:`, error);
            }
        }

        await interaction.reply({ content: `User ${user.tag} has been banned from ${banCount} servers.`, ephemeral: true });
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!args.length) {
            return message.reply('Please provide a user to ban.');
        }

        const userId = args[0].replace(/[<@!>]/g, '');
        let user;
        try {
            user = await message.client.users.fetch(userId);
        } catch (error) {
            return message.reply('Failed to fetch user. Please provide a valid user ID or mention.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        let banCount = 0;

        for (const guild of message.client.guilds.cache.values()) {
            try {
                const member = await guild.members.fetch(user.id);

                if (member && guild.members.me.permissions.has('BAN_MEMBERS')) {
                    await member.ban({ reason });
                    console.log(`Banned ${user.tag} from ${guild.name} for: ${reason}`);
                    banCount++;
                } else if (guild.members.me.permissions.has('BAN_MEMBERS')) {
                    await guild.members.ban(user, { reason });
                    console.log(`Banned ${user.tag} from ${guild.name} for: ${reason}`);
                    banCount++;
                }
            } catch (error) {
                console.error(`Failed to ban ${user.tag} from ${guild.name}:`, error);
            }
        }

        await message.reply(`User ${user.tag} has been banned from ${banCount} servers.`);
    },
};
