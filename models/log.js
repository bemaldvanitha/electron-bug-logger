const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    priority:{
        type: String,
        required: true
    },
    user: {
        type:String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

const Logs = mongoose.model('logs',bugSchema);
module.exports = Logs;