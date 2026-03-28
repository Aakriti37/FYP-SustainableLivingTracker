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

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);