const locationModel = require("../model/location.model");

const findUserLocation = async () => {
  try {
    let allUsers = await usermodel.find({});
    return allUsers;
  } catch (error) {
    console.log(error);
    return false;
  }
};