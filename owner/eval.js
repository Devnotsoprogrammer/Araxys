const { SlashCommandBuilder } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Executes code snippets for debugging and testing purposes.')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to execute')
                .setRequired(true)),

    async execute(interaction) {
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const code = interaction.options.getString('code');

        try {
            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await interaction.reply({ content: `\`\`\`js\n${evaled}\`\`\``, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: `\`\`\`js\n${err}\`\`\``, ephemeral: true });
        }
    },

    async executePrefixed(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        const code = args.join(' ');

        try {
            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await message.reply(`\`\`\`js\n${evaled}\`\`\``);
        } catch (err) {
            await message.reply(`\`\`\`js\n${err}\`\`\``);
        }
    },
};
