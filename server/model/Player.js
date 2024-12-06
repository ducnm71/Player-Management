const helper = require('../controller/helper')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    key: { type: String, required: true },
    type: {type: String, enum: ['day', 'month', 'year'], default: 'day'},
    expireTime: {type: String, required: true},
    timeIn: { type: String, required: true},
    weight: { type: Number, required: true},
    height: { type: Number, required: true },
})

const Player = mongoose.model('Player', playerSchema, 'players')
exports.schema = Player


const extendCard = (type) => {
    let now = new Date();
    switch(type) {
        case 'day':
            return helper.formatDate(now, false)
        case 'month': 
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return helper.formatDate(nextMonth, false)
        case 'year':
            const nextYear = new Date(now);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            return helper.formatDate(nextYear, false)
    }
}
exports.create = async function(data){
    try{
        const playerData = {
            key: data.key,
            type: data.type,
            expireTime: extendCard(data.type),
            timeIn: data.timeIn,
            weight: data.weight,
            height: data.height
        }
        const newPlayer = Player(playerData)
        await newPlayer.save()
        return newPlayer
    }catch(e){
        return {error: e}
    }
}

exports.list = async function () {
    try {
        return await Player.aggregate([
            {
                $addFields: {
                    timeInDate: { $dateFromString: { dateString: "$timeIn", format: "%m/%d/%Y %H:%M:%S" } }
                }
            },
            { $sort: { timeInDate: -1 } } // Sắp xếp giảm dần
        ]);
    } catch (e) {
        return { error: e };
    }
};


exports.get = async function (key) {
    try{
        return await Player.findOne({key: key}).lean()
    }catch(e){
        return {error: e}
    }
}

exports.update = async function(key, data) {
    try{
        if(data.hasOwnProperty('type')) {
            data = {...data, expireTime: extendCard(data.type)}
        }
        await Player.findOneAndUpdate({key: key}, data)
        return await Player.findOne({key: key}).lean()
    }catch(e){
        return {error: e}
    }
}

exports.updateById = async function(id, data) {
    try{
        await Player.findByIdAndUpdate(id, data)
        return await Player.findById(id)
    }catch(e){
        return {error: e}
    }
}

exports.delete = async function(key) {
    try{
        return await Player.findOneAndDelete({key: key})
    }catch(e){
        return {error: e}
    }
}

exports.deleteById = async function(id) {
    try{
        return await Player.findByIdAndDelete(id)
    }catch(e){
        return {error: e}
    }
}