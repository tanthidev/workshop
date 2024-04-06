// const customers = require('../models/customer')
const Event = require('../models/event');
const upload = require('../../middlewares/upload');
class EventController {
    // Hàm xử lý tạo sự kiện
    async handleCreateEvent(req, res) {
         // Gọi middleware upload để xử lý tải lên ảnh
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            // Lấy thông tin từ request body
            const { title, description, dateStart, dateEnd, location, speakers, expenses } = req.body;
            // Kiểm tra xem có file ảnh nền được tải lên hay không
            console.log(req.file);
            if (!req.file) {
                return res.status(400).json({ message: 'Background image is required.' });
            }

            // Lưu đường dẫn của file ảnh vào biến imagePath
            const imagePath = '/uploads/' + req.file.filename;

            // Tạo sự kiện với đường dẫn ảnh nền
            const event = new Event({
                title,
                description,
                dateStart,
                dateEnd,
                location,
                speakers,
                revenue,
                expenses,
                backgroundImage: imagePath // Lưu đường dẫn của ảnh nền vào trường backgroundImage của sự kiện
            });

            try {
                // Lưu sự kiện vào cơ sở dữ liệu
                await event.save();
                return res.status(201).json({ message: 'Event created successfully.' });
            } catch (error) {
                return res.status(500).json({ message: 'Failed to create event.', error: error.message });
            }
        });
    }

}


module.exports = new EventController();
