const EventHeaderModel = require('../model/eventHeaderModel')

const createEventHeader = async (req, res) => {
    try {
        const { eventHeader, eventHeaderDescription } = req.body

        const checkeventheader = await EventHeaderModel.find()

        console.log(checkeventheader[0]);

        const eachCheckEventHeaders = checkeventheader[0]
        

        if(checkeventheader) {
            eachCheckEventHeaders.eventHeader = eventHeader
            eachCheckEventHeaders.eventHeaderDescription = eventHeaderDescription

            console.log('After', checkeventheader);
            
            await eachCheckEventHeaders.save()
            
            return res.status(201).json(checkeventheader)
        }

        const eventheader = await EventHeaderModel.create({...req.body})

        return res.status(201).json(eventheader)
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = { createEventHeader }