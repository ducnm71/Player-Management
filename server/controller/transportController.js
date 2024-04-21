const transportModel = require('../model/Transport')
const helper = require('./helper')

exports.insert = async function(req, res){
    try{
        let data = req.body
        const currentTime = new Date()
        data = {...data, timeIn: helper.formatDate(currentTime)}
        const templates = await transportModel.get(data.template)
        if(templates.length == 0){
            const newTransport = await transportModel.create(data)
            if(newTransport.hasOwnProperty('error')) return res.status(500).json({message: newTransport.error})
            return res.status(200).json(newTransport)
        }
        templates.sort(function(a, b) {
            var timeA = new Date(a.timeIn);
            var timeB = new Date(b.timeIn);
            return timeA - timeB;
        })
        const lastItem = templates[templates.length - 1]
        if (lastItem.timeOut == ""){
            const result = await transportModel.update(lastItem._id, {timeOut: helper.formatDate(currentTime)})
            if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
            return res.status(200).json(result)
        }

        const newTransport = await transportModel.create(data)
        if(newTransport.hasOwnProperty('error')) return res.status(500).json({message: newTransport.error})
        return res.status(200).json(newTransport)

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.list = async function(req, res){
    try{
        const result = await transportModel.getAll()
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}