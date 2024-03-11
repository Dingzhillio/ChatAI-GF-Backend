import { mongoose } from 'mongoose';

const chatHistoryModelSchema = mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        cht_id: {
            type: String,
            required: true
        },
        userSend: {
            type: Boolean,
            required: true
        },
        content: {
            type: String,
        },
        voice_id: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const ChatHistory = mongoose.model('ChatHistory', chatHistoryModelSchema);

export default ChatHistory;