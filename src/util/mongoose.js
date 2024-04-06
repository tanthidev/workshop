
module.exports = {
            mulToObject: function(mongoose){
                        return mongoose.map(mongoose => mongoose.toObject());
            },
            singleToObject: function(mongoose){
                        return mongoose ? mongoose.toObject(): mongoose;
            }
};