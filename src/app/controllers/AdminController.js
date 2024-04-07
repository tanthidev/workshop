const Event = require('../models/event')
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
        // Assuming `dateToCheck` represents the date you want to filter by
        const dateToCheck = new Date(); // This represents the current date/time

        // Constructing the query to filter documents where the dateField is greater than or equal to the specified date
        const query = { dateStart: { $gte: dateToCheck } };

         Event.find(query)
            .populate('speakers')
            .lean() // Use the lean() method to return plain JavaScript objects
            .then(events => {
                console.log(events);
                res.render("admin/events", {layout: 'admin', 'events': events})
            })
            .catch(error => {
                // Error occurred while finding documents
                console.error(error);
                // Handle the error appropriately
            });
        // res.render("admin/events", {layout: 'admin'})
    }
}


module.exports = new AdminController();
