import {mongoose} from 'mongoose'

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.DB_URL)
        console.log(`Mongodb connected: ${connect.connection.host}`)
    } catch (error){
        console.log(`Error: ${error.message}`.underline)
        // process.exit(1)
    }
}
export default connectDB;