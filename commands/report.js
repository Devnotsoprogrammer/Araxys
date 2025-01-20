const { SlashCommandBuilder } = require('discord.js');
const { Schema, model } = require('mongoose');

// Define a schema for reports
const reportSchema = new Schema({
    userId: String,
    userName: String,
    reason: String,
    timestamp: Date
});

// Create a model for reports
const Report = model('Report', reportSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Allows users to report a problem or issue.')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the report')
                .setRequired(true)),

    async execute(interaction) {
        const reason = interaction.options.getString('reason');
        const report = new Report({
            userId: interaction.user.id,
            userName: interaction.user.tag,
            reason,
            timestamp: new Date()
        });

        await report.save();

        interaction.reply(`Thank you for your report. Our team will review it shortly.`);
    },
};
