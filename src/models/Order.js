const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        name: {type: String, required: true},
        quantity : {type: Number, required: true},
        price : {type: Number, required: true},
    },
    {_id: false}
);