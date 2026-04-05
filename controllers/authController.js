const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password manually here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,  // ← save the hashed version
            role: "user",
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        console.log("User found:", user);           // ← add this
        console.log("Password entered:", password);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: rememberMe ? "7d" : "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        });

        req.session.user = { id: user._id, email: user.email, role: user.role };

        res.json({
            message: "Login successful",
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("token");
        res.json({ message: "Logged out successfully" });
    });
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Email received:", email);
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        
        // Use updateOne to avoid triggering pre-save hook
        await User.updateOne(
            { _id: user._id },
            { 
                resetPasswordToken: hashedToken,
                resetPasswordExpire: Date.now() + 15 * 60 * 1000
            }
        );

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `You requested a password reset. Click here to reset your password:\n\n${resetUrl}\n\nThis link is valid for 15 minutes.`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: message,
        });

        res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
        console.error("Email sending error:", err);
        return res.status(500).json({ message: "Error sending email" });
    }
};

// exports.resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     try {
//         const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//         const user = await User.findOne({
//             resetPasswordToken: hashedToken,
//             resetPasswordExpire: { $gt: Date.now() },
//         });

//         if (!user) {
//             return res.status(400).json({ message: "Invalid or expired token" });
//         }

//         // Hash the new password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         await User.updateOne(
//             { _id: user._id },
//             {
//                 password: hashedPassword,        // ← use the already hashed value
//                 resetPasswordToken: null,        // ← use null instead of undefined
//                 resetPasswordExpire: null        // ← updateOne doesn't understand undefined
//             }
//         );

//         res.status(200).json({ message: "Password reset successful" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        console.log("Token received:", token);
        console.log("Password received:", password);

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        console.log("Hashed token:", hashedToken);

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed password:", hashedPassword);

        const result = await User.updateOne(
            { _id: user._id },
            {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpire: null
            }
        );

        console.log("Update result:", result);

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



exports.googleCallback = (req, res) => {
    const user = req.user;

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
};







