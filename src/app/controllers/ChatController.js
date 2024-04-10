const Event = require('../models/event');
const { format } = require('date-fns');
class ChatController { 
    home(req, res){

    }

    chat(req, res){
        res.render('chat/chat', {layout: 'chat'})
    }
}

module.exports = new ChatController();
