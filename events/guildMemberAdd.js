const ServerStats = require('../models/ServerStats');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const stats = await ServerStats.findOneAndUpdate(
            { guildId: member.guild.id },
            { $inc: { membersJoined: 1 } },
            { new: true, upsert: true }
        );

        const channel = member.guild.systemChannel;
        if (channel) {
            channel.send(`Welcome to the server, ${member}! 🎉`);
        }
    },
};
