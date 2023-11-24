const { responseData } = require("../constant/responseData");
const db = require("../models");
const Order = db.orders;
const Renter = db.renters;


exports.getAll = async (req, res, next) => {
    try {
        const allOrders = await Order.find({}).populate("renters.renter event")
        res.json(responseData(true, { orders: allOrders }, 'Lấy thông đơn hàng thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
};

exports.create = async (req, res, next) => {
    try {
        const { event, renters, address, phone } = req.body

        if (!event || !renters || renters.length === 0 || !address || !phone) {
            return res.json(responseData(false, {}, "các trường chưa hợp lệ"))
        }
        await Promise.all(renters.map(async renter => {
            const currentRenter = await Renter.findById(renter.renter)
            if (currentRenter) {
                const consumedQuantity = (currentRenter.sold || 0) + renter.quantity
                if (currentRenter.quantity < consumedQuantity) {
                    return res.json(responseData(true, {}, 'Số lượng trong kho không đủ'));
                }
            } else {
                return res.json(responseData(true, {}, 'Thiết bị không tồn tại'));
            }
        }))

        await Promise.all(renters.map(async renter => {
            const currentRenter = await Renter.findById(renter.renter)
            const consumedQuantity = (currentRenter.sold || 0) + +renter.quantity
            await currentRenter.updateOne({ sold: consumedQuantity })
        }))

        const newOrder = new Order({
            ...req.body,
            user: req.user._id
        })
        await newOrder.save()
        res.json(responseData(true, { order: newOrder }, 'Thêm đơn hàng thành công'));
    } catch (e) {
        console.log(e);
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}


exports.update = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        if(req.renters.length > 0){
            await Promise.all(req.renters.map(async renter => {
                const currentRenter = await Renter.findById(renter.renter)
                if (currentRenter) {
                    const consumedQuantity = (currentRenter.sold || 0) + renter.quantity
                    if (currentRenter.quantity < consumedQuantity) {
                        return res.json(responseData(true, {}, 'Số lượng trong kho không đủ'));
                    }
                } else {
                    return res.json(responseData(true, {}, 'Thiết bị không tồn tại'));
                }
            }))
        }
        const currentOrder = await Order.findById(id)
        if (!currentOrder) {
            return res.json(responseData(false, {}, "Đơn hàng không tồn tại"))
        }
        await currentOrder.update({ ...req.body })
        await currentOrder.reload()
        res.json(responseData(true, { order: currentOrder }, 'Cập nhật thông tin đơn hàng thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const deleteRes = await Renter.deleteOne({ _id: id })
        if (!deleteRes) {
            return res.json(responseData(false, {}, "Lỗi máy chủ"))
        }
        return res.json(responseData(true, {}, "xóa Đơn hàng thành công"))
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}


exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const order = await Order.findById(id)
        if (!order) {
            return res.json(responseData(false, {}, "Đơn hàng không tồn tại"))
        }
        return res.json(responseData(true, { order }, "lấy thông tin đơn hàng thành công"))
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}