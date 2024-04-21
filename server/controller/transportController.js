const transportModel = require('../model/Transport')

exports.getAll = async function(req, res){
    try{
        const result = await transportModel.getAll()
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}