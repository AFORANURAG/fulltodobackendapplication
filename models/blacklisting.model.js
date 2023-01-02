const mongoose=require("mongoose")
const logoutSchema=mongoose.Schema({
   token:String
},{versionKey:false})


const Logoutmodel=mongoose.model("blacklistedtoken",logoutSchema)

module.exports={Logoutmodel}