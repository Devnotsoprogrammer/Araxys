const ServerStats = require('../models/ServerStats');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const stats = await ServerStats.findOneAndUpdate(
            { guildId: message.guild.id },
            { $inc: { messages: 1 } },
            { new: true, upsert: true }
        );

        // Additional actions if needed
    },
};
