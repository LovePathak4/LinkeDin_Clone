// import User from "../models/user.model.js";
// import bcrypt from "bcrypt";
// import Profile from "../models/profile.model.js";
// import dotenv from "dotenv";
// import crypto from "crypto";
// import PDFDocument from "pdfkit"
// import fs from "fs";
// import ConnectionRequest from "../models/connection.model.js";



// const convertUserDataTOPDF = async (userData) => {
//     const doc = new PDFDocument();

//     const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
//     const stream = fs.createWriteStream("uploads/" + outputPath);

//     doc.pipe(stream);

//     doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });
//     doc.fontSize(14).text(`Name:${userData.userId.name}`);
//     doc.fontSize(14).text(`Username: ${userData.userId.username}`);
//     doc.fontSize(14).text(`Email: ${userData.userId.email}`);
//     doc.fontSize(14).text(`Username: ${userData.bio}`);
//     doc.fontSize(14).text(`current Position: ${userData.currentPosition}`);

//     doc.fontSize(14).text("Past Work:")
//     userData.pastWork.forEach((worker, index) => {
//         doc.fontSize(14).text(`company Name: ${worker.companyName}`);
//         doc.fontSize(14).text(`Position: ${worker.currentPosition}`);
//         doc.fontSize(14).text(`years: ${worker.years}`);
//     })

//     doc.end();
//     return outputPath;

// }





// export const register = async (req, res) => {
//     try {

//         const { name, email, password, username } = req.body;

//         if (!name || !email || !password || !username) {
//             return res.status(400).json({ message: "Please fill all the fields" });
//         }


//         const user = await User.findOne({ email });

//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);


//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             username,
//         });

//         await newUser.save();

//         const profile = new Profile({ userId: newUser._id });
//         await profile.save();
//         return res.json({ message: "User created successfully", user: newUser });


//     }
//     catch (error) {
//         return res.status(500).json({ message: "Server Error" });
//     }
// }






// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Please fill all the fields" });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User does not exist" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const token = crypto.randomBytes(32).toString("hex");

//         await User.updateOne({ _id: user._id }, { token });

//         return res.json({ token });



//     }
//     catch (error) {
//         return res.status(500).json({ message: "Server Error" });
//     }
// }





// export const uploadProfilePicture = async (req, res) => {
//     const { token } = req.body;

//     try {
//         const user = await User.findOne({ token });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         user.profilePicture = req.file.filename;

//         await user.save();
//         return res.json({ message: "Profile picture updated successfully" });

//     }


//     catch (error) {
//         return res.status(500).json({ message: "Server Error" });

//     }
// }





// export const updateUserProfile = async (req, res) => {

//     try {

//         const { token, ...newUserData } = req.body;

//         const user = await User.findOne({ token });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const { username, email } = newUserData;

//         const existingUser = await User.findOne({
//             $or: [
//                 { username: newUserData.username },
//                 { email: newUserData.email }
//             ],
//             _id: { $ne: user._id }
//         });

//         if (existingUser) {
//             return res.status(400).json({
//                 message: "Username or email already exists"
//             });
//         }



//         Object.assign(user, newUserData);
//         await user.save();
//         return res.status(200).json({ message: "User profile updated successfully", user });
//     }


//     catch (error) {
//         return res.status(500).json({ message: "Server Error" });
//     }
// }







// export const getUserAndProfile = async (req, res) => {

//     try {
//         const { token } = req.body;

//         const user = await User.findOne({ token });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userProfile = await Profile.findOne({ userId: user._id })
//             .populate('userId', 'name email username profilePicture');

//         return res.json(userProfile);
//         // await userProfile.save();


//     }

//     catch (error) {
//         return res.status(500).json({ message: "Server Error" });
//     }
// }






// export const updateProfileData = async (req, res) => {
//     try {
//         const { token, ...newProfileData } = req.body;

//         const userProfile = await User.findOne({ token: token })

//         if (!userProfile) {
//             return res.status(404).json({ message: "user not found" })
//         }

//         const profile_to_update = await Profile.findOne({ userId: userProfile._id })

//         // Object.assign(profile_to_update, newProfileData);
//         // await res.json({ message: "Profile Updated" });


//         const profile_to_update = await Profile.findOne({
//             userId: userProfile._id
//         });

//         if (!profile_to_update) {
//             return res.status(404).json({
//                 message: "Profile not found"
//             });
//         }

//         Object.assign(profile_to_update, newProfileData);
//         await profile_to_update.save();

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             profile: profile_to_update
//         });


//     }

//     catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// }





// export const getAllUserProfile = async (req, res) => {
//     try {
//         const profiles = await Profile.find()
//             .populate(
//                 "userId",
//                 "name username email profilePicture"
//             );

//         return res.status(200).json({ profiles });

//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }







// export const downloadProfile = async (req, res) => {
//     const user_id = req.query.id;

//     const userProfile = await Profile.findOne({ userId: user_id })
//         .populate('userId', 'name username email profilePricture');

//     let outputPath = await converUserDataToPDF(userProfile);
//     return res.json({ "message": outputPath });

// }








// export const sendConnectionRequest = async (req, res) => {

//     const { token, connectionId } = req.body;

//     try {
//         const user = await User.findOne({ token });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         const connectionUser = await User.findOne({ _id: connectionId });


//         if (!connectionUser) {
//             return res.status(404).json({ message: "Connection User not found" })

//         }
//         const existingRequest = await ConnectionRequest.findOne(
//             {
//                 userId: user._id,
//                 connectionId: connectionUser._id

//             }
//         )

//         if (existingRequest) {
//             return res.status(400).json({ message: "Request already sent" });
//         }

//         const request = new ConnectionRequest({
//             userId: user._id,
//             connectionId: connectionUser._id
//         });

//         await request.save();

//         return res.json({ message: "Request Sent" })


//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message })

//     }
// }







// export const getMyConnectionsRequests = async (req, res) => {
//     const { token } = req.body;

//     try {

//         const user = await User.findOne({ token });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         const connections = await ConnectionRequest.find({ userId: user._id })
//             .populate('connectionId', 'name username email profilePicture');

//         return res.json({ connections })


//     }
//     catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }








// export const whatAreMyConnections = async (req, rs) => {

//     const { token } = req.body;

//     try {
//         const user = await User.findOne({ token });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         const connections = await ConnectionRequest.find({ connectionId: user._id })
//             .populate('userId', 'name username email profilePicture');

//         return res.json(connections);


//     }
//     catch (err) {
//         return res.staus(500).son({ message: err.message })
//     }
// }








// export const acceptUserConnectionRequest = async (req, res) => {
//     const { token, requestId, action_type } = req.body;

//     try {

//         const user = await User.findOne({ token });

//         if (!user) {
//             return res.staus(404).json({ message: "User not found" })
//         }

//         const connection = await ConnectionRequest.findOne({ _id: requestId });

//         if (!connection) {
//             return res.status(404).json({ message: "connection not found" })
//         }

//         if (action_type === "accept") {
//             connection.staus_accepted = true;
//         } else {
//             connection.status_accepted = false;
//         }


//         await connection.save();

//         return res.json({ message: "Request Updated" })


//     }
//     catch (err) {
//         return res.status(500).json({ message: err.message });

//     }
// }







































import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import ConnectionRequest from "../models/connection.model.js";

const mkdir = promisify(fs.mkdir);
const uploadsDir = path.resolve("uploads");

// Generate a PDF resume and wait until the file is written.
const convertUserDataTOPDF = async (userData) => {
    if (!userData || !userData.userId) {
        throw new Error("User profile not found");
    }

    await mkdir(uploadsDir, { recursive: true });

    const outputPath = `${crypto.randomBytes(16).toString("hex")}.pdf`;
    const fullPath = path.join(uploadsDir, outputPath);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(fullPath);

    const finished = new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
        doc.on("error", reject);
    });

    doc.pipe(stream);

    const user = userData.userId;

    const picturePath = user.profilePicture
        ? path.join(uploadsDir, path.basename(user.profilePicture))
        : null;

    if (picturePath && fs.existsSync(picturePath)) {
        doc.image(picturePath, {
            align: "center",
            width: 100
        });
        doc.moveDown();
    }

    doc.fontSize(20).text("Resume", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.name || ""}`);
    doc.text(`Username: ${user.username || ""}`);
    doc.text(`Email: ${user.email || ""}`);
    doc.text(`Bio: ${userData.bio || ""}`);
    doc.text(`Current Position: ${ userData.currentPost || ""}`);
    doc.moveDown();

    doc.fontSize(16).text("Past Work");
    doc.moveDown(0.5);

    const pastWork = Array.isArray(userData.pastWork)
        ? userData.pastWork
        : [];

    if (pastWork.length === 0) {
        doc.fontSize(12).text("No work experience added.");
    } else {
        pastWork.forEach((work, index) => {
            doc.fontSize(12).text(`Experience ${index + 1}`);
            doc.text(`Company: ${work.company || work.companyName || ""}`);
            doc.text(`Position: ${work.position || work.currentPosition || ""}`);
            doc.text(`Years: ${work.years ?? ""}`);
            doc.moveDown();
        });
    }

    doc.end();
    await finished;

    return outputPath;
};

// Register a new user.
export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email or username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id
        });

        await profile.save();

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

// Log in and create a token.
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({
    email: String(email).trim().toLowerCase()
}).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { $set: { token } });

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

// Upload a profile picture.
export const uploadProfilePicture = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a profile picture"
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error("Upload profile picture error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

// Update basic user details.
export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "User not found or invalid token"
            });
        }

        if (
            newUserData.username !== undefined ||
            newUserData.email !== undefined
        ) {
            const conditions = [];

            if (newUserData.username) {
                conditions.push({ username: newUserData.username });
            }

            if (newUserData.email) {
                conditions.push({ email: newUserData.email });
            }

            if (conditions.length > 0) {
                const existingUser = await User.findOne({
                    $or: conditions,
                    _id: { $ne: user._id }
                });

                if (existingUser) {
                    return res.status(409).json({
                        message: "Username or email already exists"
                    });
                }
            }
        }

        // Do not allow clients to change privileged/internal fields.
        const allowedFields = ["name", "username", "email"];
        for (const field of allowedFields) {
            if (newUserData[field] !== undefined) {
                user[field] = newUserData[field];
            }
        }

        await user.save();

        return res.status(200).json({
            message: "User profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Update user profile error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

// Get the logged-in user's profile.
export const getUserAndProfile = async (req, res) => {
    try {
        const token = req.body?.token || req.query?.token;

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const userProfile = await Profile.findOne({
            userId: user._id
        }).populate(
            "userId",
            "name email username profilePicture"
        );

        if (!userProfile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.status(200).json(userProfile);
    } catch (error) {
        console.error("Get user profile error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

// Update profile information.
export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const profile = await Profile.findOne({
            userId: user._id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Update only profile fields; never overwrite userId.

       const allowedFields = ["bio", "currentPost", "pastWork", "education"];

        for (const field of allowedFields) {
            if (newProfileData[field] !== undefined) {
                profile[field] = newProfileData[field];
            }
        }

        await profile.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            profile
        });
    } catch (error) {
        console.error("Update profile data error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};



// Get all profiles.
export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate(
                "userId",
                "name username email profilePicture"
            );

        return res.status(200).json({ profiles });
    } catch (error) {
        console.error("Get all profiles error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};



// Download a user's resume PDF.
export const downloadProfile = async (req, res) => {
    try {
        const userId = req.query.id;

        if (!userId) {
            return res.status(400).json({
                message: "User id is required"
            });
        }

        const userProfile = await Profile.findOne({
            userId
        }).populate(
            "userId",
            "name username email profilePicture"
        );

        if (!userProfile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        const outputPath = await convertUserDataTOPDF(userProfile);
        const fullPath = path.join(uploadsDir, outputPath);

        return res.download(fullPath, "resume.pdf", (error) => {
            if (error && !res.headersSent) {
                console.error("Resume download error:", error);
                res.status(500).json({
                    message: "Unable to download resume"
                });
            }
        });
    } catch (error) {
        console.error("Download profile error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};




// Send a connection request.
export const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connectionId } = req.body;

        if (!token || !connectionId) {
            return res.status(400).json({
                message: "Token and connectionId are required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        if (String(user._id) === String(connectionId)) {
            return res.status(400).json({
                message: "You cannot connect with yourself"
            });
        }

        const connectionUser = await User.findById(connectionId);

        if (!connectionUser) {
            return res.status(404).json({
                message: "Connection user not found"
            });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "Request already sent"
            });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.status(201).json({
            message: "Request sent",
            request
        });
    } catch (error) {
        console.error("Send connection request error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};



// Get requests sent by the logged-in user.
export const getMyConnectionsRequests = async (req, res) => {
    try {
        const token = req.body?.token || req.query?.token;
        

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const connections = await ConnectionRequest.find({
            userId: user._id
        }).populate(
            "connectionId",
            "name username email profilePicture"
        );

        return res.status(200).json({ connections });
    } catch (error) {
        console.error("Get sent requests error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};




// Get connection requests received by the logged-in user.
export const whatAreMyConnections = async (req, res) => {
    try {
        const token = req.body?.token || req.query?.token;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const connections = await ConnectionRequest.find({
            connectionId: user._id
        }).populate(
            "userId",
            "name username email profilePicture"
        );

        return res.status(200).json({ connections });
    } catch (error) {
        console.error("Get received requests error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};



// Accept or reject a received connection request.
export const acceptUserConnectionRequest = async (req, res) => {
    try {
        const { token, requestId, action_type } = req.body;

        if (!token || !requestId ||
            !["accept", "reject"].includes(action_type)) {
            return res.status(400).json({
                message: "Token, requestId and a valid action_type are required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const connection = await ConnectionRequest.findOne({
            _id: requestId,
            connectionId: user._id
        });

        if (!connection) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        connection.status_accepted = action_type === "accept";
        await connection.save();

        return res.status(200).json({
            message: action_type === "accept"
                ? "Connection request accepted"
                : "Connection request rejected"
        });
    } catch (error) {
        console.error("Accept connection request error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

