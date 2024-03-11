import { mongoose } from 'mongoose';

const promptSchema = mongoose.Schema(
    {
        cht_id: {
            type: String,
            require: true,
            unique: true
        },
        prompt: {
            type: String
        }
    }
);

const Prompt = mongoose.model('Prompt', promptSchema)

export default Prompt;