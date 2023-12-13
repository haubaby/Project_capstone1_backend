const { responseData } = require("../constant/responseData");
const db = require("../models");
const Renter = db.renters;

exports.getAll = async (req, res, next) => {
  try {
    const allRenters = await Renter.find({}).lean();
    res.json(
      responseData(
        true,
        {
          renters: allRenters.map((item) => {
            return { ...item, id: item._id };
          }),
        },
        "lấy thông tin thiết bị thành công"
      )
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, unit, price, note, quantity } = req.body;
    if (!name || !unit || !price || !quantity) {
      return res.json(responseData(false, {}, "các trường chưa hợp lệ"));
    }
    const existedRenter = await Renter.findOne({ name });
    if (existedRenter) {
      return res.json(responseData(false, {}, "Thiết bị đã tồn tại"));
    }
    const newRenter = new Renter({
      ...req.body,
    });
    await newRenter.save();
    res.json(
      responseData(true, { renter: newRenter }, "Thêm thiết bị thành công")
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const udpatedRenter = await Renter.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    res.json(
      responseData(
        true,
        { renter: udpatedRenter },
        "Cập nhật thông tin thiết bị thành công"
      )
    );
  } catch (e) {
    console.log({ e });
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const deleteRes = await Renter.deleteOne({ _id: id });
    if (!deleteRes) {
      return res.json(responseData(false, {}, "Lỗi máy chủ"));
    }
    return res.json(responseData(true, {}, "xóa thiết bị thành công"));
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const renter = await Renter.findById(id);
    if (!renter) {
      return res.json(responseData(false, {}, "Thiết bị không tồn tại"));
    }
    return res.json(
      responseData(true, { renter }, "lấy thông tin thiết bị thành công")
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};
