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

exports.getAll = async function(){
    try{
        return await Transport.find({}).lean()
    }catch(e){
        return {error: e}
    }
}