const ServerStats = require('../models/ServerStats');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const stats = await ServerStats.findOneAndUpdate(
            { guildId: member.guild.id },
            { $inc: { membersLeft: 1 } },
            { new: true, upsert: true }
        );

        const channel = member.guild.systemChannel;
        if (channel) {
            channel.send(`Goodbye, ${member.displayName}. We'll miss you! 😢`);
        }
    },
};
