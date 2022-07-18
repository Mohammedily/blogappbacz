const express = require("express");
const userRouter = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

userRouter.post("/signup", async(req, res) => {
    const {username, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        console.log(error);
    }
   if(existingUser){
    return res.status(400).json({message:"User Already Found"});
   }
   const hassedPassword =  bcrypt.hashSync(password);
   const user = new User({
    username,email, password:hassedPassword,blogs:[]
   })
   try {
    await user.save();
   } catch (error) {
    console.log(error);
   }
   return res.status(200).json({user});
})

userRouter.post("/signin", async(req, res) => {
    const {email, password} = req.body;

    let existingUser;

    try{
    existingUser = await User.findOne({email});
    }catch(err){
        console.log(err);
    }
  
   if(!existingUser){
       return res.status(404).json({message:"no user found"});
   }
   
   const isPassword = bcrypt.compareSync(password, existingUser.password);
   if(!isPassword){
       return res.status(404).json({message:"password incorrect"});
   }

  const token = jwt.sign({_id:this._id}, process.env.JWTKEY,
    {
        expiresIn:"1h",
    })

    return res.status(200).send({data:token, message:"login Suceessfully", user:existingUser});
})

userRouter.get("/user/:id", async(req,res) => {
    const id = req.params.id;
    let Users;
 try {
    Users = await User.findById(id);
 } catch (error) {
    console.log(error);
 }   

 return res.status(200).send(Users);
})


module.exports = userRouter;