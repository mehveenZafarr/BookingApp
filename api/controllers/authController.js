import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format!" });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ error: "Email already taken!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPswd = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashPswd
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                email: newUser.email,
                name: newUser.name,
                id: newUser._id
            });
        } else {
            res.json({ error: "Invalid user data!" });
        }
    } catch (error) {
        res.status(500).json({ error: `Internal server error => ${error.message}` })
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect) {
            return res.json(400).json({error: "Invalid email or password!"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            name: user.name,
            email: user.email,
            id: user._id,
        });
        // res.cookie().json('Ok Cookie');
    } catch (error) {
        console.log("Error in loginUser Controller "+error.message);
        res.status(500).json({error: `Internal Server error ${error.message}`});
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe Controller "+ error.message);
        res.status(500).json({error: "Internal Server Error!"});
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logout successfully!"});
    } catch (error) {
        console.log("Error in logoutUser controller ", error.message);
        res.status(500).json({error: 'Internal Server Error '+error.message});
    }
}