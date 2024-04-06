const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Connect to MongoDB

dotenv.config();

async function connect(){
            try{
            await mongoose.connect(process.env.MONGODB_URL)
                        console.log("Connected to MongoDB");
            }catch(error){
                        console.log("Connect to MongoDB failed");
            }

}
module.exports = {connect};

