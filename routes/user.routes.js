require("dotenv").config();

const {Router}=require("express")
const userRouter=Router()
const {Usermodel}=require("../models/user.model")
const {Logoutmodel}=require("../models/blacklisting.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {validator}=require("../middlewares/validator.middleware")

userRouter.get("/", validator,(req,res)=>{
    res.send({"message":"welcome to userrouter"})
})
//-----------------------------login route

userRouter.post("/login",async(req,res)=>{
let {email,password}=req.body
let document=await Usermodel.findOne({email})
try {
let hashedolder=document?.password
let answer=bcrypt.compareSync(password,hashedolder)   
if(answer){
    // generate token // 
 let accesstoken=jwt.sign({emailid:email,userid:document._id},process.env.ACCESSSECURITYKEY,{expiresIn:60});  
 let refreshtoken=jwt.sign({emailid:email,userid:document._id},process.env.REFRESHSECURITYKEY,{expiresIn:60*5});
  res.cookie("accesstoken",accesstoken,{httpOnly:true})
return  res.json({message:"login successful",refreshtoken:refreshtoken,accesstoken,document});
} else{
    res.json({message:"wrong password"})
}   
} catch (error) {
    console.log(error)
    res.json({message:"server error",err:error.message})
}

})


// ----------------------------sign up route
userRouter.post("/logout",async(req,res)=>{
try {
let token=req.cookies?.accesstoken
let query=Logoutmodel({token})    
await query.save()
res.json({message:"logout successfull"})
} catch (error) {
    console.log(error)
    res.json({message:"server error"})
}

})


userRouter.get("/getnewtoken",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    console.log(token)
    try {
       jwt.verify(token,process.env.REFRESHSECURITYKEY,(err,decoded)=>{
        if (err) throw err
        if(decoded){
    console.log(decoded.emailid)
    let accesstoken=jwt.sign({emailid:decoded.emailid,userid:decoded.userid},process.env.ACCESSSECURITYKEY,{expiresIn:60})   
    res.cookie("accesstoken",accesstoken,{httpOnly:true})
return res.json({message:"request succesded"})
        }else{
            res.send({"message":"Please send a valid token"})
        }
       }) 
    
    } catch (error) {
        console.log(error)
        res.send({"message":"server error",err:error.message})
    }
    
    }


)


userRouter.post("/signup",async(req,res)=>{
let {email,name,password}=req.body
let query=await Usermodel.findOne({email})

try {
  if(!query){
bcrypt.hash(password,5,async(err,hash)=>{
if(err) throw err
let usersaved=Usermodel({email,name,password:hash})
await usersaved.save()
res.json({message:"Account created successfully"})

})


  } else{
    return res.json({message:"user already exists"})
  } 

} catch (error) {
    console.log(error)
    res.statusCode(500).json({message:"something went wrong please try again later"})
}



})



module.exports={userRouter}