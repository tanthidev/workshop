const Event = require('../models/event')
const User = require('../models/user')
const formatNumber = require('../../util/formatNumber')
const { format } = require('date-fns');
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

    editEvent(req, res){
        const eventId = req.params.id;
        let speakers; // Biến để lưu danh sách diễn giả
        // Truy vấn tất cả các diễn giả đang có trong hệ thống
        User.find({ role: 'speaker' }).lean()
        .then(listspeakers => {
            // Đây là danh sách các diễn giả đang có trong hệ thống
            speakers = listspeakers
            // Truy vấn sự kiện với thông tin đã populate cho speakers và attendees
            return Event.findOne({ _id: eventId }).populate('speakers attendees').lean();
        })
        .then(event => {
            // Xử lý dữ liệu event và render template
            const startDateTime = new Date(event.dateStart);
            event.dateStart = startDateTime.toISOString().slice(0, 16);
            const endDateTime = new Date(event.dateEnd);
            event.dateEnd = endDateTime.toISOString().slice(0, 16);
            const isSoldOut = event.attendees.length >= event.numberOfTickets;

            // Check if the current user is already registered for the event
            const isRegistered = event.attendees.some(att => att._id == req.user.user._id);
            // Check user is admin
            let isAdmin = false;
            if (req.user.user.role === 'admin') {
                isAdmin = true;
            }
             // Filter out speakers who are already assigned to the event
        speakers = speakers.filter(speaker => !event.speakers.some(evSpeaker => evSpeaker._id.toString() === speaker._id.toString()));
            res.render("admin/editEvent", {
                user: req.user.user,
                isRegistered,
                isAdmin,
                isSoldOut,
                event: event,
                speakers: speakers // Pass the speakers array to the view
            });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error(error);
            res.render("error", { error: "An error occurred" });
        });
    }

    deleteEvent(req, res){


        // Get the last part which is the ID
        const id = req.params.id;;



        Event.findOneAndDelete({ _id: id })
        .then(deletedEvent => {
            if (!deletedEvent) {
                req.flash('error', 'Delete fail!')
                return res.redirect(req.headers.referer || '/admin');
            }
            // Event deleted successfully
            req.flash('success', 'Delete success')
            return res.redirect('/admin/events');
        })
        .catch(error => {
            // Error occurred while deleting the event
            req.flash('error', 'Delete fail!')
            return res.redirect(req.headers.referer || '/admin/events');
        });
    }

    handleEditEvent(req, res){
        const {_id} = req.body
        const newData = req.body
        newData.speakers = [req.body.speaker];
        Event.updateOne({ _id}, {$set: newData})
        .then(result => {
            console.log(newData);
            if (result.acknowledged) { 
                req.flash('success', 'Update success!');
            } else {
                // Set fail flash 
                req.flash('error', 'No document found or not modified!');
            }
            return res.redirect(req.headers.referer || '/');
        })
        .catch(error => {
            // Set fail flash message
            console.log(error);
            req.flash('error', 'Update fail!');
            return res.redirect(req.headers.referer || '/');
        });
    }


}


module.exports = new AdminController();
