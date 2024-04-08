const Event = require('../models/event')
const User = require('../models/user')
const formatNumber = require('../../util/formatNumber')
class AdminController {
    // Dashboard
    index(req, res) {
        Promise.all([
            Event.countDocuments({ dateStart: { $gte: new Date() } }),
            Event.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$revenue" }
                    }
                }
            ]),
            Event.aggregate([
                {
                    $unwind: "$attendees"
                },
                {
                    $group: {
                        _id: null,
                        totalParticipants: { $sum: 1 }
                    }
                }
            ]),
            Event.countDocuments()
        ])
        .then(([totalUpComingCount, totalRevenueResult, totalParticipantsResult, totalEventCount]) => {
            const totalUpComing = totalUpComingCount || 0;
            const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
            const totalParticipants = totalParticipantsResult.length > 0 ? totalParticipantsResult[0].totalParticipants : 0;
            const totalEvent = totalEventCount || 0;
    
            res.render("admin/dashboard", {
                layout: 'admin',
                user: req.user.user,
                totalUpComing,
                totalRevenue: formatNumber(totalRevenue),
                totalParticipants,
                totalEvent,
            });
        })
        .catch(error => {
            console.error(error);
            res.render("admin/dashboard", {
                layout: 'admin',
                user: req.user.user,
                totalUpComing: 0,
                totalRevenue: 0,
                totalParticipants: 0,
                totalEvent: 0,
            });
        });
    }
    

    async createEvent(req, res){
        const listSpeaker = await User.find({role: 'speaker'}).select('full_name')
        
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

    async listUsers(req, res){
        const currentPage = parseInt(req.query.page) || 1; // Current page number, default to 1
        const limit = parseInt(req.query.limit) || 7; // Number of items per page, default to 10

        try{ 
            // Count total number of documents
            const totalDocuments = await User.countDocuments();

            // Calculate total pages
            const totalPages = Math.ceil(totalDocuments / limit);

            // Skip records based on pagination
            const skip = (currentPage - 1) * limit;

            // Query database with pagination
            User.find()
            .skip(skip)
            .limit(limit)
            .sort({ role: 1})
            .lean()
            .then(listUsers => {
                res.render("admin/users", {
                    layout: 'admin',
                    user: req.user.user,
                    listUsers,
                    currentPage,
                    totalPages,
                })
            });
            
        } catch(err){   
            console.log(err)

            res.render("admin/users", {
                layout: 'admin',
                user: req.user.user
            })
        }


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
                res.render("admin/events", {
                    layout: 'admin', 
                    events,
                    user: req.user.user
                })
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
