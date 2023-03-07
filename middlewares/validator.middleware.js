
require("dotenv").config();
const {Logoutmodel}=require("../models/blacklisting.model")
const jwt=require("jsonwebtoken")
const validator= async (req,res,next)=>{
const token=req.cookies.accesstoken
const query=await Logoutmodel.findOne({token})
console.log(query)
if(!query){
    try {
        jwt.verify(token,process.env.ACCESSSECURITYKEY,(err,decoded)=>{
         if (err) throw err
         if(decoded){
    console.log(decoded.emailid)
     if(!req.body.email){
        req.body.email=decoded.emailid
     }
             next()
     
         }else{
             res.send({"message":"Please send a valid token"})
         }
        }) 
     
     } catch (error) {
         console.log(error)
         res.send({"message":"Please login ",err:error.message})
     }
}
else{
    res.send({"message":"you are loggedout please login again"})
}


}
module.exports={validator}