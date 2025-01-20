const { SlashCommandBuilder } = require('discord.js');
const { AFK, AFKPermissions } = require('../models');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Sets a user as AFK and provides a custom AFK message when mentioned.')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for being AFK')
                .setRequired(false)),

    async execute(interaction) {
        console.log('Executing AFK command');
        console.log('Interaction:', interaction);

        try {
            if (!interaction.isCommand()) {
                throw new Error('Interaction is not a command');
            }

            const reason = interaction.options.getString('reason') || 'AFK';
            const userId = interaction.user.id;

            console.log(`AFK Reason: ${reason}`);
            console.log(`User ID: ${userId}`);

            // Bot owner can always use the command
            if (!ownerIds.includes(interaction.user.id) && !await hasPermission(interaction)) {
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            // Change the user's nickname to indicate they're AFK
            const member = interaction.guild.members.cache.get(userId);
            if (member && !member.nickname?.includes('[AFK]')) {
                await member.setNickname(`[AFK] ${member.displayName}`).catch(console.error);
            }

            await AFK.findOneAndUpdate(
                { userId },
                { reason, timestamp: new Date() },
                { upsert: true }
            );

            await interaction.reply(`You are now AFK: ${reason}`);
        } catch (error) {
            console.error('Error executing AFK command:', error);
            if (interaction.reply) {
                await interaction.reply({ content: `There was an error executing the AFK command: ${error.message}`, ephemeral: true });
            } else {
                console.error('interaction.reply is not a function');
            }
        }
    },

    async handleMessageCreate(message) {
        try {
            if (message.mentions.users.size > 0) {
                for (const [userId] of message.mentions.users) {
                    const afkStatus = await AFK.findOne({ userId });
                    if (afkStatus) {
                        message.channel.send(`<@${userId}> is currently AFK: ${afkStatus.reason}`);
                    }
                }
            }

            // Check if the user who sent the message is AFK and reset their status
            const afkStatus = await AFK.findOne({ userId: message.author.id });
            if (afkStatus) {
                await AFK.deleteOne({ userId: message.author.id });
                const member = message.guild.members.cache.get(message.author.id);
                if (member && member.nickname?.includes('[AFK]')) {
                    await member.setNickname(member.nickname.replace('[AFK] ', '')).catch(console.error);
                }
                message.channel.send(`<@${message.author.id}> I removed your AFK status. Welcome back!`);
            }
        } catch (error) {
            console.error('Error handling message create for AFK:', error);
        }
    },
};

async function hasPermission(interaction) {
    const guildId = interaction.guild.id;
    const afkPermissions = await AFKPermissions.findOne({ guildId });

    if (!afkPermissions) {
        return true; // No restrictions set, allow usage
    }

    if (afkPermissions.allowEveryone) {
        return true;
    }

    const member = interaction.guild.members.cache.get(interaction.user.id);

    return afkPermissions.allowedRoles.some(roleId => member.roles.cache.has(roleId)) ||
           ownerIds.includes(interaction.user.id);
}
