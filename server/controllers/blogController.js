import blogs from "../models/blogModel.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../config/cloudinary.js";
import fs from "node:fs";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res) => {
  const category = req.query.category;
  if (category === "" || category === "all" || !category) {
    const blogData = await blogs.find({});
    res.status(200).json(blogData);
  } else {
    const blogData = await blogs.find({ category: category });
    res.status(200).json(blogData);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blogId = req.params["blogId"];
    const author = res.locals.username;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID.",
      });
    }

    const blogData = await blogs.findById(blogId).lean();

    if (!blogData) {
      return res.status(404).json({
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      ...blogData,
      auth: blogData.author === author ? true : false,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const createBlog = async (req, res) => {
  const { title, description, category } = req.body;
  const user = res.locals.user;

  try {
    // Upload image to Cloudinary
    let imgUrl;
    
    // Check if file was uploaded
    if (req.file) {
      // Upload image to Cloudinary if file exists
      imgUrl = await uploadOnCloudinary(req.file.path);
      // Delete uploaded file after cloudinary upload
      await fs.unlinkSync(req.file.path); 
    } else {
      // Use default image if no file was uploaded
      imgUrl = await uploadOnCloudinary('./uploads/default.jpg');
    }
    if (!imgUrl) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    // Create blog entry
    const newBlog = new blogs({
      title,
      description,
      category,
      img: {
        public_id: imgUrl.public_id,
        url: imgUrl.secure_url,
      },
      author: user.username,
    });
    await newBlog.save();
    // await fs.unlinkSync(req.file.path);
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBlog = async (req, res) => {
  const blogId = req.params["id"];
  const user = res.locals.user.username;
  const UpdatedData = {
    title: req.body.title,
    description: req.body.description,
  };

  try {
    if (req.file) {
      const oldBlogData = await blogs.findOne({ _id: blogId });
      const outDatedImg = oldBlogData.img.public_id;
      const deleteImg = await deleteOnCloudinary(outDatedImg);
      const newImg = await uploadOnCloudinary(req.file.path);
      UpdatedData.img = {
        public_id: newImg.public_id,
        url: newImg.secure_url,
      };
      if (!newImg) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      fs.unlinkSync(req.file.path);
    }
    const updatedBlog = await blogs.findOneAndUpdate(
      { _id: blogId, author: user },
      UpdatedData,
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  const blogId = req.params["id"];
  const user = res.locals.user.username;

  try {
    const blogData = await blogs.findOne({ _id: blogId });
    if (!blogData) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blogData.author !== user) {
      return res.status(403).json({ message: "User is not authorized." });
    }

    const BlogImg = blogData.img.public_id;
    await deleteOnCloudinary(BlogImg);
    await blogs.findOneAndDelete({
      _id: blogId,
      author: user,
    });

    res.status(200).json({
      message: "Blog is deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBlog = async (req, res) => {
  try {
    const id = req.params["id"];
    const blogData = await blogs.find({
      $or: [
        { title: { $regex: id, $options: "i" } },
        { category: { $regex: id, $options: "i" } },
        { author: { $regex: id, $options: "i" } },
      ],
    });

    if (!blogData) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
