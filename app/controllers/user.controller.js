const {responseData} = require("../constant/responseData");
const db = require("../models");
const User = db.users;




exports.update = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const updatedUser = await User.findOneAndUpdate(id,{...req.body},{new:true})
        res.json(responseData(true, {user: updatedUser}, 'Cập nhật thông tin người dùng thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}

exports.updateSelfProfile = async (req, res) => {
    try {
        const {_id} = req.user
        if (!_id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const updatedUser = await User.findOneAndUpdate(_id,{...req.body},{new:true})
        res.json(responseData(true, {user: updatedUser}, 'Cập nhật thông tin người dùng thành công'));
    } catch (e) {
        console.log(e);
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}

exports.getAll = async (req, res) => {
    try {
        const users = await User.find({})
        res.json(responseData(true, {users: users}, 'Lấy thông tin người dùng thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}



exports.delete = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const deleteRes = await User.deleteOne({_id: id})
        if (!deleteRes) {
            return res.json(responseData(false, {}, "Lỗi máy chủ"))
        }
        return res.json(responseData(true, {}, "xóa người dùng thành công"))
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}

exports.inviteAdmin = async (req,res) => {
    try{
        const {id} = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const updatedUser = await User.findOneAndUpdate(id,{role:"admin"},{new:true})
        res.json(responseData(true, {user: updatedUser}, 'Cập nhật thông tin người dùng thành công'));
    }catch(e){
        return res.json(responseData(false, {}, "Lỗi máy chủ"))

    }
}