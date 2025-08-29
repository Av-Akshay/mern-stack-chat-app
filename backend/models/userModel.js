const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      default: "Hey there! I'm using Talk-A-Tive",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    if (!enteredPassword) {
      console.log("No password entered");
      return false;
    }

    if (!this.password) {
      console.error("Error: No stored password found in document");
      return false;
    }

    console.log("In matchPassword method");
    console.log("Stored password exists:", !!this.password);

    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("bcrypt.compare result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error in password comparison:", error);
    return false;
  }
};


userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    console.log("Hashing password during save");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
