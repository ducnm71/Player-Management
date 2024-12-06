const playerModel = require('../model/Player')
const helper = require('./helper')
const { emitToClients, pendingResponses } = require('../socket')

exports.insert = async function(req, res){
    try{
        let data = req.body
        const currentTime = new Date()
        data = {...data, timeIn: helper.formatDate(currentTime, false)}

        const result = await playerModel.get(data.key)
        if(result) {
            if (result.type == 'day') {
                //create new day card
                data = {...data, type: 'day'}
                const newPlayer = await playerModel.create(data)
                    
                if(newPlayer.hasOwnProperty('error')) {
                    return res.status(500).json({message: newPlayer.error})
                }
                
                return res.status(200).json('Add Day Card')
            } else {
                const expireTime = new Date(result.expireTime)
                const now = new Date()
                if(now > expireTime) {
                    //emit to extend card
                    //if ui confirm => update expireTime; else => delete card
                    const confirmationPromise = new Promise((resolve, reject) => {
                        pendingResponses.set('extendCard', { resolve, reject });
                    });

                    data = {...data, type: result.type, expireTime: result.expireTime}
                    emitToClients('extendCard', { message: 'Gia hạn thẻ',  data});

                    try {
                        const confirmedData = await confirmationPromise;
                        const updatedPlayer = await playerModel.update(data.key, confirmedData)
                        return res.status(200).json('Updated Data');
                    } catch (error) {
                        await playerModel.delete(data.key)
                        return res.status(400).json('No Extend');
                    }
                } else {
                    //update card data
                    const updatedPlayer = await playerModel.update(data.key, data)
                    return res.status(200).json('Updated Data')
                }
            }        
        } else {
            // emit to register card
            // create card data by type selected in ui
            const confirmationPromise = new Promise((resolve, reject) => {
                pendingResponses.set('registerCard', { resolve, reject });
            });

            emitToClients('registerCard', { message: 'Đăng ký thẻ', data });

            try {
                const confirmedData = await confirmationPromise;
                const newPlayer = await playerModel.create(confirmedData);

                if(newPlayer.hasOwnProperty('error')) {
                    return res.status(500).json({message: newPlayer.error})
                }

                return res.status(200).json('Registered');
            } catch (error) {
                return res.status(400).json('No Register');
            }
        }
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

exports.updateById = async function(req, res) {
    try{
        const data = req.body
        const id = req.params.id

        const result = await playerModel.updateById(id, data)
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})

        return res.status(200).json(result) 
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.deleteById = async function(req, res) {
    try{
        const id = req.params.id

        const result = await playerModel.deleteById(id)
        if(result.hasOwnProperty('error'))  return res.status(500).json({message: result.error})

        return res.status(200).json(result) 
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}