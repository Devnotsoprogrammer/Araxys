const mongoose = require('mongoose');

const customCommandSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    response: { type: String, required: true },
});

module.exports = mongoose.models.CustomCommand || mongoose.model('CustomCommand', customCommandSchema);
