import mongoose from "mongoose";

const characterSchema = mongoose.Schema({
    name: {
        type: String
    },
    cht_id: {
        type: String,
        require: true,
        unique: true
    },
    prompt: {
        type: String
    }
});

const Character = mongoose.model('Character', characterSchema)

export default Character;