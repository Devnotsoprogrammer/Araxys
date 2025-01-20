const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');
const { AFKPermissions } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setafkpermissions')
        .setDescription('Set who can use the AFK command')
        .addBooleanOption(option =>
            option.setName('alloweveryone')
                .setDescription('Allow everyone to use the AFK command'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('A role allowed to use the AFK command')),

    async execute(interaction) {
        const allowEveryone = interaction.options.getBoolean('alloweveryone');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has('ADMINISTRATOR') && !ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to manage AFK command permissions.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const afkPermissions = await AFKPermissions.findOne({ guildId }) || new AFKPermissions({ guildId });

        if (allowEveryone !== null) {
            afkPermissions.allowEveryone = allowEveryone;
        }

        if (role) {
            afkPermissions.allowedRoles.push(role.id);
        }

        await afkPermissions.save();

        await interaction.reply('AFK command permissions updated.');
    },
};
