const bcrypt = require("bcrypt");
const { responseData } = require("../constant/responseData");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const mongoose = require("mongoose");

// Create and Save a new Tutorial
exports.signup = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.json(responseData(false, "Lỗi máy chủ"));
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(responseData(false, {}, "'Email đã tồn tại.'"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.json(responseData(true, {}, "Đăng ký thành công."));
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.signIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.json(
        responseData(false, {}, "Vui lòng nhập email và mật khẩu")
      );
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json(
        responseData(false, {}, "Email hoặc mật khẩu không đúng")
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json(
        responseData(false, {}, "Email hoặc mật khẩu không đúng")
      );
    }
    delete user.password;
    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      "your_secret_key"
    );
    res.json(
      responseData(
        true,
        { accessToken, account: user },
        "Đăng nhập thành công."
      )
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.fetchUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.json(responseData(false, {}, "Người dùng không tồn tại"));
    }
    return res.json(
      responseData(
        true,
        { account: user },
        "Lấy thông tin người dùng thành công"
      )
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { newPassword, oldPassword } = req.body;
    if (!newPassword | !oldPassword) {
      return res.json(responseData(false, {}, "các trường chưa hợp lệ"));
    }
    if(newPassword == oldPassword){
      return res.json(responseData(false, {}, "Mật khẩu mới không được trùng với mật khẩu cũ"));
    }

    const currentUser = await User.findOne({_id}).lean()
    const isPasswordMatch =await bcrypt.compare(oldPassword,currentUser.password)
    
    if(!isPasswordMatch){
      return res.json(responseData(false, {}, "Mật khẩu cũ không hợp lệ"));
    }

    console.log(currentUser);

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ _id }, { password: hashedPassword });
    return res.json(responseData(true,{},"Thay đổi mật khẩu thành công"))
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.logout = (req, res) => {
  res.json(responseData(true, {}, "Đăng xuất thành công"));
};
