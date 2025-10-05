const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ROLES} = require('../utils/roles');

const cartItemSchema = new mongoose.Schema(
    {
        product : {type: mongoose.Schema.Types.ObjectId, ref:
            'Product', required: true} ,
        quantity : {type: Number, default:1, min:1},
        priceSnapshot: {type: Number, required: true},
    },
    {_id: false}
);

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true,
        lowercase:true},
        password : {type: String, required: true, minLength: 6,
        select: false},
        role: {type: String, enum: Object.values(ROLES),
        default: ROLES.USER},
        wishlist: [{type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'}],
        cart: [cartItemSchema],
        avatar: {type: String},
    },
    {timestamps: true}
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function comparePassword
(candidate){
    return bcrypt.compare(candidate, this.password)
}

userSchema.methods.signToken = function signToken() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


module.exports = mongoose.model('User', userSchema);