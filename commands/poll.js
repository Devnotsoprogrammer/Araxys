const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a simple poll')
        .addStringOption(option => 
            option.setName('question')
                  .setDescription('The poll question')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('options')
                  .setDescription('The poll options separated by commas')
                  .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');

        if (options.length < 2 || options.length > 10) {
            return interaction.reply({ content: 'You must provide between 2 and 10 options.', ephemeral: true });
        }

        const pollEmbed = new MessageEmbed()
            .setTitle(question)
            .setDescription(options.map((option, index) => `${index + 1}. ${option}`).join('\n'))
            .setColor('#00AAFF');

        const pollMessage = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(`${i + 1}️⃣`);
        }
    },
    async executePrefixed(message, args) {
        const question = args[0];
        const options = args.slice(1).join(' ').split(',');

        if (!question || options.length < 2 || options.length > 10) {
            return message.reply('You must provide a question and between 2 and 10 options separated by commas.');
        }

        const pollEmbed = new MessageEmbed()
            .setTitle(question)
            .setDescription(options.map((option, index) => `${index + 1}. ${option}`).join('\n'))
            .setColor('#00AAFF');

        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(`${i + 1}️⃣`);
        }
    },
};
