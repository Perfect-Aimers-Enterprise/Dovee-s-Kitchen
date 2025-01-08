const productModel = require('../model/productModel')

const createMenuProduct = async (req, res) => {

    try {
        const { menuProductName, menuDescription, menuPrice } = req.body
        menuImageUrl = req.file.filename

        const menuProduct = await productModel.create({ menuProductName, menuDescription, menuPrice, menuImage:menuImageUrl })

        console.log(menuProduct);
        

        if (!menuProduct) {
            return res.status(404).json({message: 'Please fill up all required field'})
        }

        res.status(201).json({menuProduct, message: 'Product uploaded Successfully'})
    } catch (error) {
        res.status(500).json({error, message: 'something went wrong'})
    }
}

const getMenuProducts = async (req, res) => {
    try {
        const menuProduct = await productModel.find().sort({ createdAt: -1 });
    // if (!menuProduct) {
    //     return res.status(404).json({message: 'No product Found'})
    // }

    res.status(201).json(menuProduct)
    } catch (error) {
        res.status(500).json({message: 'Error Fetching Product'})
    }
}

const getSingleMenuProduct = async (req, res) => {

    try {
        const { id:menuProductId } = req.params;
        const menuProduct = await productModel.findById({_id:menuProductId})
        res.status(201).json(menuProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteMenuProduct = async (req, res) => {
    try {
        const { id:menuProductId } = req.params
        const menuProduct = await productModel.findOneAndDelete({_id:menuProductId})

        res.status(201).send('Product Successfully Deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateMenuProduct = async (req, res) => {
    try {
        const { id:menuProductId } = req.params
        const { menuProductName, menuDescription, menuPrice } = req.body;

        const menuProduct = await productModel.findOneAndUpdate(
            { _id:menuProductId},
            { menuProductName, menuDescription, menuPrice },
            { new: true, runValidators: true}
        )
        res.status(201).json(menuProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = { createMenuProduct, getMenuProducts, getSingleMenuProduct, deleteMenuProduct, updateMenuProduct}