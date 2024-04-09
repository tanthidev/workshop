const User = require('../models/user')
const Event = require('../models/event');
const upload = require('../../middlewares/upload');
const mongoose = require('mongoose');

const formatNumber = require('../../util/formatNumber')
const { format } = require('date-fns');


class UserController {
    //GET /news
    profile(req, res) {
        res.render("user/profile", 
            {
                user: req.user.user
            }
        )
    }

    //Handle
    handleChangeProfile(req, res) {
        const newData = req.body;
        const {_id} = req.body
        User.updateOne({_id}, {$set: newData})
        .then(result => {
            if (result.acknowledged) { 
                req.user.user = newData;
                console.log('new req:')
                console.log(req.user);
                // Set success flash 
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

    //List user (pagination)
    async listUser(req, res){
        
   }

   eventsRegister(req, res){

    // Query events where the user has attended
    Event.find({ attendees: req.user.user._id })
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

        
        res.render('user/eventsRegister', {
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




module.exports = new UserController();
