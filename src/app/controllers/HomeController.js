const Event = require('../models/event');
const { format } = require('date-fns');
class HomeController {
    //GET /news
    index(req, res) {
        // Lấy thời gian hiện tại
        const currentDate = new Date();

        Event.find({ dateStart: { $gte: currentDate } })
        .sort({ dateStart: 1 }) // Sắp xếp theo thời gian bắt đầu tăng dần
        .populate('speakers')
        .limit(4)
        .lean() // Use the lean() method to return plain JavaScript objects
        .then(events => {
            events.forEach(event => {
                event.dateStart = format(new Date(event.dateStart), 'HH:mm-dd/MM/yyyy');
                event.dateEnd = format(new Date(event.dateEnd), 'HH:mm-dd/MM/yyyy');
            });
            res.render("home", {
                events,
                user: req.user.user
            })
        })
        .catch(error => {
            // Error occurred while finding documents
            console.error(error);
            // Handle the error appropriately
        });
    }

    //search
    search(req, res) {
        res.render('search');
    }
}


module.exports = new HomeController();
