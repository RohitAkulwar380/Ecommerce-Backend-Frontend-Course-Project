const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        slug: {type: String, index: true},
        description : {type: String, default: ''},
        price: {type: Number, required: true, min: 0},
        stock : {type: Number, default: 0, min: 0},
        images : [{type: String}],
        category : {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    },
    {timestamps: true}
);

productSchema.pre('save', function setSlug(next){
    if(this.isModified('name')){
        this.slug = slugify(this.name, {lower: true, strict: true});
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);