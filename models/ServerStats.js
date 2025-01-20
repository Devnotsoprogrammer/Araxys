const mongoose = require('mongoose');

const serverStatsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    messages: { type: Number, default: 0 },
});

module.exports = mongoose.models.ServerStats || mongoose.model('ServerStats', serverStatsSchema);

