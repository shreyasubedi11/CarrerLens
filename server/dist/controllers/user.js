import axios from "axios";
import { oauth2client } from "../config/googleconfig.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            message: "Authorixation code is required",
        });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
        expiresIn: "15d",
    });
    res.json({
        message: "User Loggedin",
        token,
        user,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
