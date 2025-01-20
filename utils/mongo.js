const mongoose = require('mongoose');
const { mongoURI } = require('./config.json'); // Adjusted to ensure correct path

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB: ', err);
});

const { Schema, model } = mongoose;

const afkSchema = new Schema({
    userId: String,
    reason: String,
    timestamp: Date
});

const afkPermissionsSchema = new Schema({
    guildId: String,
    allowedRoles: [String],
    allowEveryone: Boolean
});

const giveawaySchema = new Schema({
    channelId: String,
    messageId: String,
    prize: String,
    winnersCount: Number,
    endTime: Date,
    ended: Boolean,
    participants: [String]
});

const rankSchema = new Schema({
    userId: String,
    userName: String,
    rank: Number,
    xp: Number
});

const rankUpdateChannelSchema = new Schema({
    serverId: String,
    channelId: String
});

const levelRolesSchema = new Schema({
    serverId: String,
    level: Number,
    roleId: String
});

const models = {
    AFK: model('AFK', afkSchema),
    AFKPermissions: model('AFKPermissions', afkPermissionsSchema),
    Giveaway: model('Giveaway', giveawaySchema),
    Rank: model('Rank', rankSchema),
    RankUpdateChannel: model('RankUpdateChannel', rankUpdateChannelSchema),
    LevelRoles: model('LevelRoles', levelRolesSchema)
};

// Load level roles on startup
const levelRoles = {};
async function loadLevelRoles() {
    const roles = await models.LevelRoles.find();
    for (const role of roles) {
        levelRoles[role.level] = role.roleId;
    }
}
loadLevelRoles().catch(err => console.error('Error loading level roles:', err));

async function checkForRoleUpdate(guild, user, level) {
    for (const [lvl, roleId] of Object.entries(levelRoles)) {
        const role = guild.roles.cache.get(roleId);
        if (role) {
            const member = guild.members.cache.get(user.id);
            if (level >= lvl && !member.roles.cache.has(roleId)) {
                await member.roles.add(role);
                const rankUpdateChannel = await models.RankUpdateChannel.findOne({ serverId: guild.id });
                if (rankUpdateChannel) {
                    const channel = guild.channels.cache.get(rankUpdateChannel.channelId);
                    if (channel) {
                        channel.send(`Congratulations <@${user.id}>! You've reached level ${level} and have been given the ${role.name} role!`);
                    }
                }
            } else if (level < lvl && member.roles.cache.has(roleId)) {
                await member.roles.remove(role);
            }
        }
    }
}

module.exports = { ...models, loadLevelRoles, checkForRoleUpdate, levelRoles };
