const userservice = require("../service/user.service");
const crypto = require("crypto-js");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "locationtracking";
const bcrypt = require("bcryptjs");
const Location = require("../model/location.model");
const sendResponse = require("../helper/send.response");
const usermodel = require("../model/user.model");
// const userModel = require("../model/user.model");
const register = async (req, res) => {
  try {
    /*
    1. email,name,password is required!
    2.vaildate name ,email,password
    */
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const { email, name, password } = req.body;
    console.log(email, name);
    //   validate field
    if (!email || !password || !name)
      return sendResponse(res, 400, {
        status: false,
        message: "Please fill all details",
      });
    else if (spChars.test(name) || name.match(numbers)) {
      return sendResponse(res, 400, {
        status: false,
        message: "name must not have special characters and numbers !",
      });
    } else if (!validator.validate(email)) {
      return sendResponse(res, 400, {
        status: false,
        message: "please enter correct email",
      });
    } else if (!password.match(upperCaseLetters) || password.length < 8) {
      return sendResponse(res, 400, {
        status: false,
        message: "Password must have at least 8 characters and one uppercase!",
      });
    }

    let checkuser = await userservice.findUserByMail(email);
    // console.log("dfghj", checkuser);
    if (checkuser) {
      return sendResponse(res, 400, {
        status: false,
        message: "Email already exist",
      });
    }

    //  let saltRounds = 90;
    //  let  salt = bcrypt.genSaltSync(saltRounds);
    // let hashedPass = crypto.HmacSHA512(password, Key);
    const hashedPass = bcrypt.hashSync(password);
    // console.log(hashedPass,"degefgejbfjgfrj")
    const user = await userservice.create({
      email: email.toLowerCase(),
      password: hashedPass,
      name: name,
    });
    if (!user)
      return sendResponse(res, 400, {
        status: false,
        message: "something went wrong....",
      });
    return sendResponse(res, 200, {
      status: true,
      data: user,
      message: "Signup Success",
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, {
      status: false,
      message: "Internal Error",
    });
  }
};

const signin = async (req, res) => {
  const { email, password, usertype } = req.body;
  console.log("req.body", email, password);
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await usermodel.find({ email });
    console.log("user:", user); // Add this line for debugging
    if (!user || user.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compareSync(password, user[0].password);
    console.log("isMatch:", isMatch); // Add this line for debugging
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user[0]._id }, JWT_SECRET, {
      expiresIn: "3d",
    });
    res.status(200).json({
      token,
      user: {
        id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        usertype: user[0].usertype,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

const findusers = async (req, res) => {
  try {
    const usersWithLocations = await usermodel
      .aggregate([
        {
          $match: { usertype: "user" },
        },
        {
          $lookup: {
            from: "locations",
            localField: "_id",
            foreignField: "user_id",
            as: "user_locations",
          },
        },
      ])
      .exec();

    if (!usersWithLocations || usersWithLocations.length === 0) {
      return sendResponse(res, 400, {
        status: false,
        message: "No users found with usertype 'user'",
      });
    }

    // If users are found, return the response
    return sendResponse(res, 200, {
      status: true,
      data: usersWithLocations,
      message: "Users with locations found",
    });
  } catch (error) {
    console.error("Error finding users with locations:", error);
    return sendResponse(res, 500, {
      status: false,
      message: "Internal Error",
    });
  }
};

const userlocation = async (req, res) => {
  const { latitude, longitude, user_id } = req.body;
  console.log(latitude, longitude, user_id, "");

  try {
    const existingLocation = await Location.findOne({ user_id });

    if (existingLocation) {
      existingLocation.latitude = latitude;
      existingLocation.longitude = longitude;
      await existingLocation.save();
      res.json({ message: "Location updated successfully" });
    } else {
      // If user does not exist, save new location
      const newLocation = new Location({
        latitude,
        longitude,
        user_id,
      });
      await newLocation.save();
      res.json({ message: "Location saved successfully" });
    }
  } catch (error) {
    console.error("Error saving/updating location:", error);
    res.status(500).json({ error: "Error saving/updating location" });
  }
};

const getLocationDetailsBasedOnId = async (id) => {
  try {
    // Find the location document based on the userId
    const location = await Location.findOne({ user_id: id });
    if (location) {
      // Extract latitude and longitude from the location document
      const latitude = location.latitude;
      const longitude = location.longitude;
      return { latitude, longitude };
    } else {
      return "This user location does not exit"; // User location not found
    }
  } catch (error) {
    console.error("Error retrieving user location:", error.message);
    throw error;
  }
};

const getboundaryalert = async ({ user_id }) => {
  const Adminid = await usermodel.findOne({ usertype: "admin" });

  const admId = Adminid._id;
  console.log("admin id: ", admId);

  const adminLandL = await getLocationDetailsBasedOnId(admId);

  const user = await usermodel.findOne({ _id: user_id });
  console.log(user, "user_id");
  const username = user.name;

  const userLandL = await getLocationDetailsBasedOnId(user_id);

  const boundary = {
    center: { latitude: adminLandL.latitude, longitude: adminLandL.longitude },
    radius: 408000,
  };
  console.log(boundary, "boundary");
  const userLocation = {
    latitude: userLandL.latitude,
    longitude: userLandL.longitude,
  };
  console.log("userLoaction", userLocation);

  const distance = calculateDistance(boundary.center, userLocation);

  console.log(distance, "distance", boundary.radius);
  if (distance <= boundary.radius) {
    // User is within the boundary
    return { message: ` ${username} is within the boundary.` };
  } else {
    // User is outside the boundary
    return { message: `${username} is outside the boundary.` };
  }
};

const getboundary = async (req, res) => {
  // Admin boundry by default location se 5 km // Admin > location , boundry
  // user is come within range > alert bhejna
  // button click > location user (User saved location DB);

  const admId = req.body.adminId; //'663383350cf963c0fbbb4dd9';
  const adminLandL = await getLocationDetailsBasedOnId(admId);

  const userId = req.params.userId; //'66347db9f472d3799bba69df';
  const userLandL = await getLocationDetailsBasedOnId(userId);
  // Admin boundry range
  const boundary = {
    center: { latitude: adminLandL.latitude, longitude: adminLandL.longitude },
    radius: 1000,
  };

  // Check user's current location (You can get user's location from req.query or req.body)
  const userLocation = {
    latitude: userLandL.latitude,
    longitude: userLandL.longitude,
  };
  // console.log("userLocation", userLocation, "adminLocation", adminLandL);
  // Calculate distance between user location and boundary center
  const distance = calculateDistance(boundary.center, userLocation);

  // Check if user is within the boundary
  if (distance <= boundary.radius) {
    // User is within the boundary
    res.json({ message: "User is within the boundary." });
  } else {
    // User is outside the boundary
    res.json({ message: "User is outside the boundary." });
  }
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(point1, point2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = toRadians(point1.latitude);
  const φ2 = toRadians(point2.latitude);
  const Δφ = toRadians(point2.latitude - point1.latitude);
  const Δλ = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

module.exports = {
  register,
  signin,
  findusers,
  userlocation,
  getboundary,
  getboundaryalert,
};
