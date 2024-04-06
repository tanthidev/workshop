// const customers = require('../models/customer')
const users = require('../models/user')
class AdminController {
    //GET /news
    index(req, res) {
        res.render("admin/dashboard", {layout: 'admin'})
    }

    async createEvent(req, res){
        const listSpeaker = await users.find({role: 'speaker'}).select('full_name')
        
        const speakers = listSpeaker.map(speaker => {
            return {
                _id: speaker._id, // Assuming _id is the ID of the speaker in the database
                full_name: speaker.full_name // Assuming full_name is the name of the speaker in the database
            };
        });
        res.render("admin/createEvent",  
            { speakers},
        )
    }

    listUsers(req, res){
        res.render("admin/users", {layout: 'admin'})
    }

    listEvents(req, res){
        res.render("admin/events", {layout: 'admin'})
    }
}


module.exports = new AdminController();
