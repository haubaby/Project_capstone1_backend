const { responseData } = require("../constant/responseData");
const db = require("../models");
const Order = db.orders;
const Renter = db.renters;

exports.getAll = async (req, res, next) => {
  try {
    const allOrders = await Order.find({})
      .populate("renters.renter user")
      .lean();
      // console.log(allOrders.transform());
    const results = allOrders.map((order) => {
      return {
        id:order._id,
        ...order,
        renters: order.renters.map((item) => ({
          ...item,
          renter: { id: item.renter._id, ...item.renter },
        })),
      };
    });
    res.json(
      responseData(true, { orders: results }, "Lấy thông đơn hàng thành công")
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.getUserOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allOrders = await Order.find({ user: id })
      .populate("renters.renter user")
      .lean();
    const results = allOrders.map((order) => {
      return {
        id:order._id,
        ...order,
        renters: order.renters.map((item) => ({
          ...item,
          renter: { id: item.renter._id, ...item.renter },
        })),
      };
    });
    res.json(
      responseData(true, { orders: results }, "Lấy thông đơn hàng thành công")
    );
  } catch (e) {
    console.log(e);
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { renters, method } = req.body;

    if (!renters || renters.length === 0 || !method) {
      return res.json(responseData(false, {}, "các trường chưa hợp lệ"));
    }

    // for (let renter of renters) {
    //     const currentRenter = await Renter.findById(renter.renter)
    //     if (currentRenter) {
    //         const consumedQuantity = (currentRenter.sold || 0) + renter.quantity
    //         if (currentRenter.quantity < consumedQuantity) {
    //             return res.json(responseData(true, {}, 'Số lượng trong kho không đủ'));
    //         }
    //     } else {
    //         return res.json(responseData(true, {}, 'Thiết bị không tồn tại'));
    //     }
    // }

    await Promise.all(
      renters.map(async (renter) => {
        const currentRenter = await Renter.findById(renter.renter);
        const consumedQuantity = (currentRenter.sold || 0) + +renter.quantity;
        await currentRenter.updateOne({ sold: consumedQuantity });
      })
    );

    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });
    await newOrder.save();
    return res.json(
      responseData(true, { order: newOrder }, "Thanh toán thành công")
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
    // const currentRenter = await Renter.findById(updatedRenterId)
    // if (currentRenter) {
    //     const currentOrder = await Order.findById(id)
    //     if (!currentOrder) {
    //         return res.json(responseData(false, {}, "Đơn hàng không tồn tại"))
    //     }
    //     const orderRenters = currentOrder.renters
    //     const currentRenterOrder = orderRenters.find(item => item.renter == updatedRenterId)

    //     const consumedQuantity = (currentRenter.sold || 0) - currentRenterOrder.quantity + +quantity
    //     if (currentRenter.quantity < consumedQuantity) {
    //         return res.json(responseData(true, {}, 'Số lượng trong kho không đủ'));
    //     }
    //     await currentRenter.update({sold: consumedQuantity})
    //     await currentOrder.update({$set: {'renters.$[elem].quantity': +quantity}}, {
    //         arrayFilters: [{'elem.renter': updatedRenterId}], new: true
    //     });
    //     const orderRes = await Order.findById(id).populate("renters.renter event")
    //     res.json(responseData(true, {order: orderRes}, 'Cập nhật thông tin đơn hàng thành công'));
    // } else {
    //     return res.json(responseData(true, {}, 'Thiết bị không tồn tại'));
    // }

    const orderRes = await Order.findOneAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).populate("renters.renter event");
    res.json(
      responseData(
        true,
        { order: orderRes },
        "Cập nhật thông tin đơn hàng thành công"
      )
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
    const deleteRes = await Order.deleteOne({ _id: id });
    if (!deleteRes.deletedCount) {
      return res.json(responseData(false, {}, "Lỗi máy chủ"));
    }
    return res.json(responseData(true, {}, "xóa Đơn hàng thành công"));
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};

exports.deleteRenterOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { renterId } = req.body;
    if (!id || !renterId) {
      return res.json(responseData(false, {}, "Id không hợp lệ"));
    }
    const order = await Order.findById(id);
    const currentRenterOrders = order.renters;
    const renterOrderRes = currentRenterOrders.filter((renter) => {
      return renter.renter !== renterId;
    });
    await order.update({ renters: renterOrderRes });
    return res.json(
      responseData(true, {}, "xóa thiết bị trong đơn hàng thành công")
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
    const order = await Order.findById(id).lean();
    if (!order) {
      return res.json(responseData(false, {}, "Đơn hàng không tồn tại"));
    }
    return res.json(
      responseData(true, { order:{...order,id:order._id} }, "lấy thông tin đơn hàng thành công")
    );
  } catch (e) {
    return res.json(responseData(false, {}, "Lỗi máy chủ"));
  }
};
