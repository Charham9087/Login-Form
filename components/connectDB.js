import mongoose from "mongoose";


export default async function ConnectDB(){
    try {
        await mongoose.connect(process.env.Mongo_URI)
        console.log("connected to DB✅")
    }catch(error){
        console.log("can't connect to DB❌",error)
        

    }
}