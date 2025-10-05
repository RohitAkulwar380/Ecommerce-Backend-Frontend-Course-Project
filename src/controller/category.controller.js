const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try{
        const category = await Category.create(req.body);
        res.status(201).json({success: true, data: category});
    } catch(err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.updateCategory = async (req, res) => {
    try{
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!category) return res.status(404).json({success: false, message: 'Category not found.'});
        res.json({success: true, data: category})
    } catch(err) {
        res.status(400).json({success: false, message: err.message});
    }
}   

exports.deleteCategory = async (req, res) => {
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        if(!category) return res.status(404).json({success: false, message: 'Category not found.'});
        res.json({success: true, message: 'Category deleted'});
    }catch(err) {
        res.status(400).json({success: false, message: err.message});
    }
    
}

exports.getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category)  return res.status(404).json({success: false, message: 'Category not found.'});
    res.json({success: true, data: category});
}

exports.getCategories = async (req, res) => {
    const categories = await Category.find({}).sort('name');
    res.json({success: true, data: categories});
}

