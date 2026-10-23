// import User from "../models/user.model.js";
// import bcrypt from "bcrypt";
// import Profile from "../models/profile.model.js";
// import dotenv from "dotenv";
// //import { addTransitionType } from "react";
// import Post from "../models/posts.model.js";
// import Comment from "../models/comments.model.js";




// dotenv.config();

// export const activeCheck = async (req, res) => {
//     return res.status(200).json({ message: "RUNNING" });

// };



// export const createPost = async (req, res) => {
//     const { token } = req.body;

//     try {
//         const user = await User.findOne({ token: token });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const post = new Post({
//             userId: user._id,
//             body: req.body.body,
//             media: req.file != undefined ? req.file.filename : "",
//             fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
//         })

//         await post.save();

//         return res.status(200).json({ message: "Post Created" })

//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }








// export const getAllPosts = async (req, res) => {
//     try {

//         const posts = await Post.find().populate('userId', 'name username email profilePicture')
//         return res.json({ posts })


//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }









// export const deletePost = async (req, res) => {
//     const { token, post_id } = req.body;

//     try {
//         const user = await User.findOne({ token: token })
//             .select("_id");


//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const post = await Post.findOne({ _id: post_id });

//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }


//         if (post.userId.toString() !== user._id.toString()) {
//             return res.status(401).json({ message: "unauthorized Acess" });
//         }

//         await Post.deleteOne({ _id: post_id });

//         return res.json({ message: "Post Deleted" });


//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }










// export const commentPost = async (req, res) => {
//     const { token, post_id, commentBody } = req.body;

//     try {
//         const user = await User.findOne({ token: token }).select("_id");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         const post = await Post.findOne({
//             _id: post_id
//         });

//         if (!post) {
//             return res.status(404).json({ message: "Post not found" })
//         }

//         const comment = new comment({
//             userId: user._id,
//             postId: post_id,
//             body: commentBody
//         });

//         await comment.save();

//         return res.status(201).json({ message: "Comment Added" ,comment });


//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }









// export const get_comment_by_post = async (req, res) => {
//     const { post_id } = req.query;

//     try {
//         const post = await Post.findOne({ _id: post_id });

//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }
//         return res.json({ comments: post.comments });


//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }








// export const delete_comment_of_user = async (req, res) => {

//     const { token, comment_id } = req.body;

//     try {
//         const user = await User.findOne({ token: token }).select("_id");

//         if (!user) {
//             return res.status(404).json({ message: "USer not found" })
//         }

//         const comment = await Comment.findOne({ "_id": comment_id });

//         if (!comment) {
//             return res.status(404).json({ message: "Comment not found" })
//         }

//         if (comment.userId.toString() !== user._id.toString()) {
//             return res.status(401).json({ message: "Unauthorized" })
//         }
//         await Comment.deleteOne({ "_id": comment_id });

//         return res.json({ message: "Comment Deleted" });

//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }









// export const increment_likes= async(req, res)=>{
//     const{post_id}= req.body;

//     try{

//         const post =await Post.findOne({_id: post_id});

//         if(!post){
//             return res.status(404).json({message: "Post not found"})
//         }
        
//         post.likes= post.likes+1;

//         await post.save();

//         return res.json({message:"Likes Incremented"})



//     }
//     catch(error){
//         return res.status(500).json({message: error.message});
//     }
// }




















































import User from "../models/user.model.js";
import dotenv from "dotenv";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

dotenv.config();

// Check whether the backend is running.
export const activeCheck = async (req, res) => {
    return res.status(200).json({
        message: "RUNNING"
    });
};

// Create a post.
export const createPost = async (req, res) => {
    try {
        const { token, body } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        if (!body && !req.file) {
            return res.status(400).json({
                message: "Post text or media is required"
            });
        }

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const post = new Post({
            userId: user._id,
            body: body || "",
            media: req.file ? req.file.filename : "",
            fileType: req.file
                ? req.file.mimetype.split("/")[1]
                : ""
        });

        await post.save();

        return res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Get all posts.
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate(
                "userId",
                "name username email profilePicture"
            )
            .sort({ _id: -1 });

        return res.status(200).json({ posts });
    } catch (error) {
        console.error("Get posts error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Delete a post owned by the logged-in user.
export const deletePost = async (req, res) => {
    try {
        const { token, post_id } = req.body;

        if (!token || !post_id) {
            return res.status(400).json({
                message: "Token and post_id are required"
            });
        }

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this post"
            });
        }

        await Post.deleteOne({ _id: post._id });

        // Remove comments belonging to this post.
        await Comment.deleteMany({ postId: post._id });

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Delete post error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Add a comment to a post.
export const commentPost = async (req, res) => {
    try {
        const { token, post_id, commentBody } = req.body;

        if (!token || !post_id || !commentBody?.trim()) {
            return res.status(400).json({
                message: "Token, post_id and commentBody are required"
            });
        }

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Use the imported Comment model, not new comment().
        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            body: commentBody.trim()
        });

        await comment.save();

        await comment.populate(
            "userId",
            "name username profilePicture"
        );

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        console.error("Add comment error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Get comments for a specific post.
export const get_comment_by_post = async (req, res) => {
    try {
        const { post_id } = req.query;

        if (!post_id) {
            return res.status(400).json({
                message: "post_id is required"
            });
        }

        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Comments are stored in the Comment collection.
        const comments = await Comment.find({
            postId: post._id
        })
            .populate(
                "userId",
                "name username profilePicture"
            )
            .sort({ _id: 1 });

        return res.status(200).json({ comments });
    } catch (error) {
        console.error("Get comments error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Delete a comment owned by the logged-in user.
export const delete_comment_of_user = async (req, res) => {
    try {
        const { token, comment_id } = req.body;

        if (!token || !comment_id) {
            return res.status(400).json({
                message: "Token and comment_id are required"
            });
        }

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const comment = await Comment.findById(comment_id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment"
            });
        }

        await Comment.deleteOne({ _id: comment._id });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Delete comment error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

// Increment post likes.
// Note: this retains your existing count-based likes implementation.
export const increment_likes = async (req, res) => {
    try {
        const { post_id, token } = req.body;

        if (!post_id || !token) {
            return res.status(400).json({
                message: "post_id and token are required"
            });
        }

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const post = await Post.findByIdAndUpdate(
            post_id,
            { $inc: { likes: 1 } },
            { new: true, runValidators: true }
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Likes incremented",
            likes: post.likes
        });
    } catch (error) {
        console.error("Increment likes error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};
