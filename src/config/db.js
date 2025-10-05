const mongoose = require ('mongoose');

async function connectDB(mongouri){
    const uri = mongouri || process.env.MONGO_URI
    if(!uri){
        throw new Error("MONGO_URI is not defined.");
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri)
}

module.exports = {connectDB};