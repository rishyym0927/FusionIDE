import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        _id: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', messageSchema);

export default Message;
