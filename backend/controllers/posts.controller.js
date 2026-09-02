import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import dotenv from "dotenv";

dotenv.config();

export const activeCheck= async( req, res) => {
    return res.status(200).json({message: "RUNNING"});

};




