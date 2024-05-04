const usermodel = require("../model/user.model");

const findUserByMail = async (email) => {
  try {
    const data = await usermodel.findOne({ email: email });
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const create = async (data) => {
  try {
    let user = new usermodel(data);
    await user.save();
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const findAllUsers = async () => {
  try {
    let allUsers = await usermodel.find({});
    return allUsers;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  create,
  findUserByMail,
  findAllUsers,
};
