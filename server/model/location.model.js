const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    // city: {
    //   type: String,
    //   required: true,
    // },
    // state: {
    //   type: String,
    //   required: true,
    // },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
