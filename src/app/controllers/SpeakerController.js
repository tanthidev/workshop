const Event = require('../models/event');

const formatNumber = require('../../util/formatNumber')
const { format } = require('date-fns');
class HomeController {
    //GET /news
    listEvents(req, res) {
            // Query events where the user has attended
    Event.find({ speakers: req.user.user._id })
    .populate('speakers')
    .lean()
    .then(events => {
        const currentDate = new Date();
        // Separate events into two variables based on whether they have occurred or not
        const upcomingEvents = events.filter(event => new Date(event.dateStart) > currentDate);
        const pastEvents = events.filter(event => new Date(event.dateEnd) < currentDate);
        events.map(event => {
            event.dateStart = format(new Date(event.dateStart), 'HH:mm-dd/MM/yyyy');
            event.expenses = formatNumber(event.expenses);
            event.full_name = req.user.user.full_name;
        });

        
        res.render('speaker/listEvents', {
            user: req.user.user,
            upcomingEvents,
            pastEvents
        })

        // Handle the upcoming and past events here
    })
    .catch(error => {
        console.error('Error querying events:', error);
        // Handle errors here
    });
    }

}


module.exports = new HomeController();
