const transportModel = require('../model/Transport')
const helper = require('./helper')

exports.insert = async function(req, res){
    try{
        let data = req.body
        const currentTime = new Date()
        data = {...data, timeIn: helper.formatDate(currentTime, false)}
        const templates = await transportModel.get(data.template)           //kiểm tra xem có biển số xe đang vào chưa
        if(templates.length == 0){
            const newTransport = await transportModel.create(data)          // nếu chưa có thì tạo 1 bản ghi mới
            if(newTransport.hasOwnProperty('error')) return res.status(500).json({message: newTransport.error})
            return res.status(200).json(newTransport)
        }
        templates.sort(function(a, b) {                 
            var timeA = new Date(a.timeIn);
            var timeB = new Date(b.timeIn);
            return timeA - timeB;
        })
        const lastItem = templates[templates.length - 1]        //nếu có rồi thì tìm ra bản ghi mới nhất
        if (lastItem.timeOut == ""){
            const result = await transportModel.update(lastItem._id, {timeOut: helper.formatDate(currentTime, true)}) // nếu bản ghi đó chưa có timeOut thì cập nhật, tức là xe đi ra
            if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
            return res.status(200).json(result)
        }

        const newTransport = await transportModel.create(data)              //nếu bản ghi đó có timeOut rồi thì tạo 1 bản ghi mới
        if(newTransport.hasOwnProperty('error')) return res.status(500).json({message: newTransport.error})
        return res.status(200).json(newTransport)

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.list = async function(req, res){
    try{
        const result = await transportModel.list()  //lấy ra danh sách biển số xe
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}