const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: function () {
        // Password is not required if user logs in with Google
        return !this.googleId;
      }
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // Password Reset Fields
    resetPasswordToken: {
      type: String
    },

    resetPasswordExpire: {
      type: Date
    },

    // Google OAuth Field
    googleId: {
      type: String
    }

  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);