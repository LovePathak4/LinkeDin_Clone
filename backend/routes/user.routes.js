import {Router} from "express";
import { downloadProfile, register, uploadProfilePicture } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";
import multer from "multer";
import { updateUserProfile } from "../controllers/user.controller.js";
import {getUserAndProfile} from "../controllers/user.controller.js"; 
import { updateProfileData } from "../controllers/user.controller.js";
import { getAllUserProfile } from "../controllers/user.controller.js";






const router=Router();

const storage= multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
});


const upload = multer({storage: storage});


router.route("/update_profile_picture")
.post(upload.single('profile_picture'), uploadProfilePicture)



router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").post(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").post(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);






export default router;

