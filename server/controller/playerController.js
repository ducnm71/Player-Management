const playerModel = require('../model/Player')
const helper = require('./helper')

exports.insert = async function(req, res){
    try{
        let data = req.body
        const currentTime = new Date()
        data = {...data, timeIn: helper.formatDate(currentTime, false)}

        const newPlayer = await playerModel.create(data)             
        if(newPlayer.hasOwnProperty('error')) return res.status(500).json({message: newPlayer.error})
        return res.status(200).json(newPlayer)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.list = async function(req, res){
    try{
        const result = await playerModel.list()
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}