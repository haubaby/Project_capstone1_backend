const bcrypt = require("bcrypt")
const {responseData} = require("../constant/responseData");
const jwt = require("jsonwebtoken")
const db = require("../models");
const moment = require("moment/moment");
const serviceModel = require("../models/service.model");
const Event = db.events;
const Service = db.service;


// Create and Save a new Tutorial
exports.getAll = async (req, res, next) => {
    try {
        const allEvents = await Event.find({}).select("title banner")
        res.json(responseData(true, {events: allEvents}, 'lấy thông tin sự kiện thành công'));
    } catch (e) {
        console.log(e)
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
};


exports.create = async (req, res, next) => {
    try {
        const {title, content, banner, startDate, endDate, service} = req.body
        if (!title || !content || !banner || !startDate || !endDate || !service) {
            return res.json(responseData(false, {}, "Các trường chưa hợp lệ"))
        }
        const newEvent = new Event({
            ...req.body,
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD")
        })
        await newEvent.save()
        res.json(responseData(true, {event: newEvent}, 'Thêm sự kiện thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}

exports.update = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const currentEvent = await Event.findById(id)
        if (!currentEvent) {
            return res.json(responseData(false, {}, "Sự kiện không tồn tại"))
        }
        const updatedData = {
            ...req.body,
            startDate:req.body.startDate ?  moment(req.body.startDate).format("YYYY-MM-DD") : currentEvent.startDate,
            endDate: req.body.startDate ?  moment(req.body.endDate).format("YYYY-MM-DD") : currentEvent.endDate
        }
        await currentEvent.update({...updatedData})
        await currentEvent.reload()
        res.json(responseData(true, {event: currentEvent}, 'Cập nhật thông tin Sự kiện thành công'));
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}


exports.findById = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.json(responseData(false, {}, "Id không hợp lệ"))
        }
        const event = await Event.findById(id).populate({path:"service",select:"title",model:Service})
        if (!event) {
            return res.json(responseData(false, {}, "Sự kiện không tồn tại"))
        }
        return res.json(responseData(true, {event}, "lấy thông tin Sự kiện thành công"))
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
        const deleteRes = await Event.deleteOne({_id: id})
        if (!deleteRes) {
            return res.json(responseData(false, {}, "Lỗi máy chủ"))
        }
        return res.json(responseData(true, {}, "xóa Sự kiện thành công"))
    } catch (e) {
        return res.json(responseData(false, {}, "Lỗi máy chủ"))
    }
}