const specialProductSchema = require('../model/specialProductModel')


const getMenuProducts = async (req, res) => {
    try {
        const menuProduct = await specialProductSchema.find().sort({ createdAt: -1 });

    res.status(201).json(menuProduct)
    } catch (error) {
        res.status(500).json({message: 'Error Fetching Product'})
    }
}

const getSingleMenuProduct = async (req, res) => {

    try {
        const { id:menuProductId } = req.params;
        const menuProduct = await specialProductSchema.findById({_id:menuProductId})
        res.status(201).json(menuProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteMenuProduct = async (req, res) => {
    try {
        const { id:menuProductId } = req.params
        const menuProduct = await specialProductSchema.findOneAndDelete({_id:menuProductId})

        res.status(201).send('Product Successfully Deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

const createSpecialProduct = async (req, res) => {

    try {
        const { specialProductName, specialDescription, specialPrice } = req.body

        console.log(req.body);
        
        const specialImageUrl = req.file.filename

        const specialProduct = await specialProductSchema.create({ specialProductName, specialDescription, specialPrice, specialImage:specialImageUrl })

        console.log(specialProduct);
        

        if (!specialProduct) {
            return res.status(404).json({message: 'Please fill up all required field'})
        }

        res.status(201).json({specialProduct, message: 'Product uploaded Successfully'})
    } catch (error) {
        res.status(500).json({error, message: 'something went wrong'})
    }
}

const updateSpecialProduct = async (req, res) => {
    try {
        const { id:menuProductId } = req.params
        const { specialProductName, specialDescription, specialPrice } = req.body;

        const specialProduct = await specialProductSchema.findOneAndUpdate(
            { _id:menuProductId},
            { specialProductName, specialDescription, specialPrice },
            { new: true, runValidators: true}
        )
        res.status(201).json(specialProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {getMenuProducts, getSingleMenuProduct, deleteMenuProduct, createSpecialProduct, updateSpecialProduct}