const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    key: { type: String, required: true },
    timeIn: { type: String, required: true},
    weight: { type: Number, required: true},
    height: { type: Number, required: true },
})

const Player = mongoose.model('Player', playerSchema, 'players')
exports.schema = Player

exports.create = async function(data){
    try{
        const playerData = {
            key: data.key,
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

exports.list = async function(){
    try{
        return await Player.find({}).lean()
    }catch(e){
        return {error: e}
    }
}