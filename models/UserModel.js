import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"]
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    links: {
      type: [String]
    },
    profession: {
      type: String
    },
    bannerImage:{
      type:String
    },
    profileImage:{
      type:String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
