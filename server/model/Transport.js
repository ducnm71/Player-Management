const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transportSchema = new Schema({
    key: { type: String, required: true },
    template: { type: String, required: true},
    timeIn: { type: String, required: true},
    timeOut: { type: String}
})

const Transport = mongoose.model('Transport', transportSchema, 'transports')
exports.schema = Transport


exports.create = async function(data){
    try{
        const transportData = {
            key: data.key,
            template: data.template,
            timeIn: data.timeIn,
            timeOut: ''
        }
        const newTransport = Transport(transportData)
        await newTransport.save()
        return newTransport
    }catch(e){
        return {error: e}
    }
}

exports.get = async function(template){
    try{
        return await Transport.find({template: template}).lean()
    }catch(e){
        return {error: e}
    }
}

exports.list = async function(){
    try{
        return await Transport.find({}).lean()
    }catch(e){
        return {error: e}
    }
}

exports.update = async function(id, data){
    try{
        await Transport.findByIdAndUpdate(id, data)
        return await Transport.findById(id)
    }catch(e){
        return {error: e}
    }
}