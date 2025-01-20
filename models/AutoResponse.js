const mongoose = require('mongoose');

const autoResponseSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
});

// Check if the model already exists to avoid OverwriteModelError
module.exports = mongoose.models.AutoResponse || mongoose.model('AutoResponse', autoResponseSchema);
