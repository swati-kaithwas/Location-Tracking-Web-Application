const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    usertype: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
