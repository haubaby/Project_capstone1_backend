const bcrypt = require("bcrypt");
const { responseData } = require("../constant/responseData");
const jwt = require("jsonwebtoken");
const db = require("../models");
const moment = require("moment/moment");
const Service = db.service;
const Renter = db.renters;

// Create and Save a new Tutorial
exports.getAllWithCustom = async (req, res, next) => {
  try {
    let fillteredList = {};
    if (req.query.title) {
      const regexFilter = new RegExp(req.query.title, "i");
      fillteredList = {
        ...fillteredList,
        $or: [{ title: { $regex: regexFilter } }],
      };
    }

    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      
      fillteredList = {
        ...fillteredList,
        createdAt: {
          $gte: startDate,
        },
      };
    }

    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      fillteredList = {
        ...fillteredList,
        createdAt: {
          ...(fillteredList.createdAt || {}),
          $lte: endDate,
        },
      };
    }
    const allService = await Service.find({...fillteredList}).populate(
      "settings.renters.renter"
    );
    const formattedServices = allService.map((item) => {
      item = item._doc;
      return {
        id: item._id,
        title: item.title,
        settings: item.settings.map((st) => ({
          name: st.name,
          renters: st.renters.map((renter) => {
            const { ...info } = renter._doc.renter || {};
            return {
              renter: {
                id: info._id || "",
                ...info._doc,
              },
              quantity: renter.quantity || null,
              price: renter.price || null,
            };
          }),
        })),
      };
    });

    res.json(
      responseData(
        true,
        { services: formattedServices },
        "lấy thông tin dịch vụ thành công"
      )
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};
exports.getAll = async (req, res, next) => {
  try {
    let fillteredList = {};
    if (req.query.title) {
      const regexFilter = new RegExp(req.query.title, "i");
      fillteredList = {
        ...fillteredList,
        $or: [{ title: { $regex: regexFilter } }],
      };
    }

    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      
      fillteredList = {
        ...fillteredList,
        createdAt: {
          $gte: startDate,
        },
      };
    }

    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      fillteredList = {
        ...fillteredList,
        createdAt: {
          ...(fillteredList.createdAt || {}),
          $lte: endDate,
        },
      };
    }

    const allService = await Service.find({ ...fillteredList }).populate(
      "settings.renters.renter"
    );
    const formattedServices = allService.map((item) => {
      item = item._doc;
      return {
        id: item._id,
        title: item.title,
        settings: item.settings.map((st) => ({
          name: st.name,
          renters: st.renters.map((renter) => {
            const { ...info } = renter._doc.renter || {};
            return {
              renter: {
                id: info._id || "",
                ...info._doc,
              },
              quantity: renter.quantity || null,
              price: renter.price || null,
            };
          }),
        })),
      };
    });
    res.json(
      responseData(
        true,
        { services: formattedServices },
        "lấy thông tin dịch vụ thành công"
      )
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.json(responseData(false, {}, "các trường chưa hợp lệ"));
    }
    const existedService = await Service.find({ title });

    if (existedService.length > 0) {
      return res.json(responseData(false, {}, "dịch vụ đã tồn tại"));
    }

    const newService = new Service({
      ...req.body,
      // settings: [],
    });
    await newService.save();
    res.json(
      responseData(true, { service: newService }, "Thêm dịch vụ thành công")
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const updatedService = await Service.findOneAndUpdate({
      ...req.body,
    }).populate("renters.renter");
    res.json(
      responseData(true, { service: updatedService }, "Thêm dịch vụ thành công")
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const deleteRes = await Service.deleteOne({ _id: id });
    if (!deleteRes) {
      return res.json(responseData(false, {}, "Lỗi máy chủ"));
    }
    return res.json(responseData(true, {}, "xóa dịch vụ thành công"));
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.addSettingOption = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }

    const currentService = await Service.findOne({ _id: id });

    if (!currentService) {
      return res.json(responseData(false, {}, "Dịch vụ không tồn tại"));
    }

    const { renters, servicePack } = req.body;
    const addedRenter = renters.map((renter) => ({
      price: renter.price,
      quantity: renter.quantity,
      renter: renter.id,
    }));
    const currentSettings = currentService.settings;
    currentSettings.push({
      name: servicePack,
      renters: addedRenter,
    });

    const updatedService = await Service.findOneAndUpdate(
      { _id: id },
      {
        settings: currentSettings,
      },
      { new: true }
    ).populate("settings.renters.renter");
    return res.json(
      responseData(
        true,
        { service: updatedService },
        "Cập nhật dịch vụ thành công"
      )
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const serviceDetail = await Service.findById(id).populate(
      "settings.renters.renter"
    );
    return res.json(
      responseData(
        true,
        { service: serviceDetail },
        "Lấy thông tin dịch vụ thành công"
      )
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.getRentersByOption = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const { name } = req.query;

    const serviceDetail = await Service.findOne({ _id: id });
    if (!serviceDetail) {
      return res.json(responseData(false, {}, "Dịch vụ không tồn tại"));
    }
    const settings = serviceDetail ? serviceDetail.settings : [];
    const currentSetting = settings.find((item) => item.name == name);
    if (!currentSetting) {
      return res.json(responseData(false, {}, "Gói không tồn tại"));
    }
    const formatted = {
      name,
      renters: currentSetting.renters.map((item) => ({
        id: item.renter,
        quantity: item.quantity || null,
        price: item.price || null,
      })),
    };
    return res.json(
      responseData(
        true,
        { setting: formatted },
        "Lấy thông tin dịch vụ thành công"
      )
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};
