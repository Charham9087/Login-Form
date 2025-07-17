import mongoose from "mongoose";




    const loginSchema = new mongoose.Schema({
         username:{
            type: String,
            require: true
        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minLength:8
        },
       
    },{
        'collection': "login_data"
    }

)
const loginUser = mongoose.models.login_data|| mongoose.model("login_data",loginSchema)
export default loginUser

