const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Assign or remove a role to a user')
        .addRoleOption(option => 
            option.setName('role')
                  .setDescription('The role to assign or remove')
                  .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to assign or remove the role from')
                  .setRequired(true)),
    
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const member = interaction.options.getMember('user');

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true });
        }

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: 'You do not have permission to manage roles.', ephemeral: true });
        }

        try {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                await interaction.reply(`Removed ${role.name} role from ${member.user.username}.`);
            } else {
                await member.roles.add(role);
                await interaction.reply(`Assigned ${role.name} role to ${member.user.username}.`);
            }
        } catch (error) {
            console.error('Error managing role:', error);
            await interaction.reply({ content: 'An error occurred while managing the role. Please try again later.', ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (args.length < 2) return message.reply('Usage: !role <role> <user>');
        
        const roleName = args[0];
        const userName = args.slice(1).join(' ');
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        const member = message.guild.members.cache.find(member => member.user.username === userName);

        if (!role) return message.reply('Role not found.');
        if (!member) return message.reply('User not found.');
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply('I do not have permission to manage roles.');
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply('You do not have permission to manage roles.');

        try {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                await message.reply(`Removed ${role.name} role from ${member.user.username}.`);
            } else {
                await member.roles.add(role);
                await message.reply(`Assigned ${role.name} role to ${member.user.username}.`);
            }
        } catch (error) {
            console.error('Error managing role:', error);
            await message.reply('An error occurred while managing the role. Please try again later.');
        }
    },
};
