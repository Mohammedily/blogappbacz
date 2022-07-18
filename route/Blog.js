const express = require("express");
const blogRouter = express.Router();
const Blog = require("../model/Blog");
const mongoose = require("mongoose");
const User = require("../model/User");
const cloudinary = require("../utils/cloudinary");

blogRouter.post("/blog/post", async(req, res) => {
    const {title, image, description,user} = req.body;
  
    
    let existingUser;

     

     try {
      
        existingUser = await User.findById(user);
     } catch (error) {
        console.log(error);
     }
     if(!existingUser){
        return res.status(500).json({message:"no id found"});
     }

     const result =  await cloudinary.uploader.upload(image,{
        folder: "product"
    })

    const blog = new Blog({
        title,
         image: result.secure_url,
          description,
          user
    })
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog)
        await existingUser.save({ session })
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
    }
    return res.status(200).json({blog});
})


blogRouter.get("/blog/get", async(req, res) => {
    let blogs;

    try{
     blogs = await Blog.find();
    }catch(err){
       return console.log(err);
    }

    if (!blogs) {
        return res.status(404).json({message:'No Blogs Found'})
    }
    return res.status(200).json( blogs )
})

blogRouter.put("/blog/update/:id", async(req, res) => {
    const { title, description} = req.body;

     const blogId = req.params.id;
  let blog;
  try{
    blog = await Blog.findByIdAndUpdate(blogId, {
        title,
        description
   })
  }catch(err){
       return console.log(err);
  }

  if(!blog) {
      return res.status(500).json({ message:"Unable to Update the blog" })
  }
  return  res.status(200).json({blog})
})


blogRouter.delete("/blog/delete/:id", async(req,  res) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err) {
        return console.log(err)
    }
  
    if(!blog){
        return res.status(500).json({ message:"unable to delete" })
    }
   return res.status(200).json({message:"Sucessfully Delete"})
})


blogRouter.get("/blog/detial/:id", async(req, res) => {
    const id = req.params.id;
   let blog;
   try{
       blog = await Blog.findById(id).populate("user")
   }catch(err) {
        return console.log(err);
   }
   if(!blog) {
       return res.status(404).json({message:"No Blog Found"})
    }
    return res.status(200).json({blog})
})

blogRouter.get("/blog/userdetial/:id", async(req, res) => {
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }catch(err){
        console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blog Found"})
    }
   return res.status(200).json({blogs:userBlogs})  
})

module.exports = blogRouter;

//    public_id: result.public_id,
// url: