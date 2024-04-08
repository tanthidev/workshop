// const customers = require('../models/customer')
const { format } = require('date-fns');

const Event = require('../models/event');
const upload = require('../../middlewares/upload');
const formatNumber = require('../../util/formatNumber')
class EventController {
    // Hàm xử lý tạo sự kiện
    async handleCreateEvent(req, res) {
         // Gọi middleware upload để xử lý tải lên ảnh
        upload(req, res, async function (err) {
            if (err) {
                console.log(err);
                // Set success flash 
                req.flash('error', 'Create fail!');
                return res.redirect('/admin/event/create');
            }

            // Lấy thông tin từ request body
            const { title, description, dateStart, dateEnd, location, speakers, expenses } = req.body;
            // Kiểm tra xem có file ảnh nền được tải lên hay không
            console.log(req.file);
            if (!req.file) {
                // Set success flash 
                req.flash('error', 'Background is require!');
                return res.redirect('/admin/event/create');
            }

            // Lưu đường dẫn của file ảnh vào biến imagePath
            const imagePath = '/images/' + req.file.filename;

            // Tạo sự kiện với đường dẫn ảnh nền
            const event = new Event({
                title,
                description,
                dateStart,
                dateEnd,
                location,
                speakers,
                expenses,
                backgroundImage: imagePath // Lưu đường dẫn của ảnh nền vào trường backgroundImage của sự kiện
            });

            try {
                // Lưu sự kiện vào cơ sở dữ liệu
                await event.save();
                // Set success flash 
                req.flash('success', 'Create success!');
                return res.redirect('/admin/event/create');
            } catch (error) {
                 // Set success flash 
                 req.flash('error', 'Create fail!!');
                 return res.redirect('/admin/event/create');
            }
        });
    }

    // Chi tiet su kien

    detail(req, res) {
        const eventId = req.params.id;

        Event.findOne({_id: eventId})
        .populate('speakers attendees')
        .lean() // Use the lean() method to return plain JavaScript objects
        .then(event => {
            event.dateStart = format(new Date(event.dateStart), 'HH:mm-dd/MM/yyyy');
            event.dateEnd = format(new Date(event.dateEnd), 'HH:mm-dd/MM/yyyy');

            // Check if the current user is already registered for the event
            const isRegistered = event.attendees.some(att => att._id == req.user.user._id);

            // Check user is admin
            let isAdmin = false;
            if(req.user.user.role === 'admin') {
                isAdmin = true;
            }


            res.render("event/detail", {
                user: req.user.user,
                isRegistered,
                isAdmin,
                event: event,
            })
        })
        .catch(error => {
            req.flash('error', `${error}`);
            res.redirect('/')
        });
    }

    payment(req, res) {
        const eventId = req.params.id;

        Event.findOne({_id: eventId})
        .populate('speakers')
        .lean() // Use the lean() method to return plain JavaScript objects
        .then(event => {
            event.dateStart = format(new Date(event.dateStart), 'HH:mm-dd/MM/yyyy');
            event.dateEnd = format(new Date(event.dateEnd), 'HH:mm-dd/MM/yyyy');
            event.expenses = formatNumber(event.expenses)
            res.render("event/payment", {
                user: req.user.user,
                event: event
            })
        })
        .catch(error => {
            res.render("/", {
                user: req.user.user,
            })
        });
    }

    async handleRegister(req, res){
        try {
            const { userId, eventId } = req.body;
             // Fetch the event details including the ticket price
            const event = await Event.findById(eventId).select('expenses');

            const ticketPrice = event.expenses;
            // Update the event document to add the attendee
            const result = await Event.updateOne(
                { _id: eventId }, // Query to find the event by its ID
                { 
                    $push: { attendees: userId }, // Add userId to the attendees array
                    $inc: { revenue: ticketPrice } // Increment revenue by the ticketPrice

                } 
            );
    
            if (result.nModified === 0) {
                // If no document was modified, it means the event was not found
                req.flash('error', "The event was not found");
                return res.redirect('/event/detail/'+eventId);
            }
    
            // If no document was modified, it means the event was not found
            req.flash('success', "Register successfull");
            return res.redirect('/event/detail/'+eventId);
        } catch (error) {
            req.flash('error', "Fail register");
            return res.redirect('/event/detail/'+eventId);
        }
    }



}


module.exports = new EventController();
