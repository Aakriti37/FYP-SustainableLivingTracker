const User = require("../models/User");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        
        if (password) {
            user.password = password; // pre-save hook will hash it
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id).select("-password");
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
