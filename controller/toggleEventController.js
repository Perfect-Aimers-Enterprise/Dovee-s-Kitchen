const ToggleEventModel = require('../model/toggleModel')

const initiateToggle = async (req, res) => {
    try {
        const checkToggleState = await ToggleEventModel.find()
        // console.log(checkToggleState);

        const eachCheckToggleState = checkToggleState[0]
        // console.log(eachCheckToggleState);


        if (!eachCheckToggleState || eachCheckToggleState == null || eachCheckToggleState == undefined) {

            // console.log('Empty array');

            const createToggleState = await ToggleEventModel.create({ toggleEventStatus: 'Checked' })

            // console.log(createToggleState);


            return res.status(201).json(createToggleState)
        }


        eachCheckToggleState.toggleEventStatus == 'unChecked' ? eachCheckToggleState.toggleEventStatus = 'Checked' :
            eachCheckToggleState.toggleEventStatus = 'unChecked'

        console.log('Aftermath', eachCheckToggleState);

        await eachCheckToggleState.save()

        return res.status(201).json(eachCheckToggleState)

    } catch (error) {
        console.log(error);

    }
}

const getToggleStatus = async (req, res) => {
    try {
        const checkToggleState = await ToggleEventModel.find()
        const eachCheckToggleState = checkToggleState[0]

        return res.status(201).json(eachCheckToggleState)
    } catch (error) {
        console.log(error)
    }
}


module.exports = { initiateToggle, getToggleStatus }