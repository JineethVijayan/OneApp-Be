import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import { sendOtpEmail } from "../utils/mailer.js";
import Otp from "../models/OtpModel.js";
import { userToken } from "../utils/generateToken.js";
import { cloudinaryInstance } from "../config/cloudinary.js";





export const sendOtp = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        await Otp.deleteOne({ email });

        const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

        const otp = generateOTP();

        const newOtp = new Otp({
            email,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        })

        console.log(newOtp);


        await newOtp.save();

        await sendOtpEmail(email, otp);

        return  res.status(200).json({ message: "OTP sent successfully to your  email!" });

    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP.", error });
        console.log(error);

    }

}


export const checkUserEmail = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" })

        const emailExist = await User.findOne({ email });

        if (emailExist) return res.status(400).json({ message: "Email already exists" });

        return res.status(200).json({ message: "Email available" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred while checking if the email already exists" });
    }

}

export const checkUserName = async (req, res) => {
    try {
        const { userName } = req.body;

        if (!userName) return res.status(400).json({ message: "User name is required" })

        const userNameExist = await User.findOne({ userName })

        if (userNameExist) return res.status(400).json({ message: "User name already exists" });

        return res.status(200).json({ message: "User name available" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred while checking if the user name already exists" });
    }
}

export const checkOtp = async (req, res) => {
    try {

        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) return res.status(400).json({ message: 'Email and otp are required' });

        const storedOtp = await Otp.findOne({ email });


        if (!storedOtp) return res.status(400).json({ message: 'otp expired or invalid' });


        if (parseInt(storedOtp.otp) !== parseInt(verificationCode)) {
            return res.status(400).json({ message: 'Invalid otp or otp expired' });
        }

        await Otp.deleteOne({ email });

        return res.status(200).json({ message: "Otp verified successfully" });

    } catch (error) {
        return res.status(500).json({ message: "error verifying otp" })
    }
}


export const createUser = async (req, res) => {
    try {
        const { email, password, dateOfBirth, phoneNumber, country, userName } = req.body;

        if (!email || !password || !dateOfBirth || !phoneNumber || !country || !userName) return res.status(400).json({ message: 'All fields are required' })

        const existingEmail = await User.findOne({ email });

        if (existingEmail) return res.status(400).json({ message: 'email is already in use' });

        const existingUserName = await User.findOne({ userName });

        if (existingUserName) return res.status(400).json({ message: 'user name is already in use' });


        const saltRounds = 10;

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email,
            password: hashPassword,
            dateOfBirth,
            phoneNumber,
            country,
            userName,
            role:'user'
        })

       const newUserCreated =  await newUser.save();

       if(!newUserCreated) return res.status(400).json({message:"Failed to creating new user"});

       const token = userToken(newUserCreated);

       const userResponse = newUserCreated.toObject();

       delete userResponse.password ;

       return res.status(200).json({ message: "user registered successfully",user:userResponse,token });

    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error });
        console.log(error);

    }
}


export const login = async (req, res) => {
    try {

        const { identifier, password } = req.body;

        if (!identifier || !password) return res.status(400).json({ message: "All fields are required" });

        const isNumeric = /^\d+$/.test(identifier);

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { userName: { $regex: new RegExp(`^${identifier}$`, "i") } },
                { phoneNumber: isNumeric ? Number(identifier) : null }
            ]
        }).select("+password");
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = userToken(user);

        const logedUser = user.toObject();

        delete logedUser.password ;

        return res.json({ message: "Login successful" ,user:logedUser,token});

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const getCurrentUser = async (req,res)=>{
    try {
       console.log("getuser profile reach",req.user.data);

       const email = req.user.data ;

       if(!email) return res.status(400).json({message:'email missing unauthorized'})
       
       const user = await User.findOne({email});
       if (!user){
           return res.status(404).json({message:'user not found'});
       }

       return res.status(200).json(user);
 
   } catch (error) {
       res.status(500).json({message:'Server error'})
      }
  }


export const updateUser = async (req, res) => {
    try {
        // console.log(req.files);
        // console.log(req.body);
        
        const { userId, name, description, links, profession } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "user id  required" });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure images are provided if this is the first time adding them



        if (!user.bannerImage && !req.files?.bannerImage) {
            return res.status(400).json({ message: "Banner image is required" });
        }
        if (!user.profileImage && !req.files?.profileImage) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        // Upload new images to Cloudinary
        let bannerImage = user.bannerImage;
        let profileImage = user.profileImage;

        const uploadToCloudinary = (buffer, folder) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinaryInstance.uploader.upload_stream(
                    { folder, resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(buffer);
            });
        };

        if (req.files?.bannerImage) {
            bannerImage = await uploadToCloudinary(req.files.bannerImage[0].buffer, "banners");
        }

        if (req.files?.profileImage) {
            profileImage = await uploadToCloudinary(req.files.profileImage[0].buffer, "profiles");
        }

        // Update user with the new data
        user = await User.findByIdAndUpdate(
            userId,
            {
                name,
                description,
                links,
                profession,
                bannerImage,
                profileImage,
            },
            { new: true }
        );

        return res.status(200).json({ message: "User data updated", user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
