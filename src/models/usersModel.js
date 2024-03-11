import { mongoose } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        remainTime: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User