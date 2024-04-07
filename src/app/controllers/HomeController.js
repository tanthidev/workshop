// const customers = require('../models/customer')
class HomeController {
    //GET /news
    index(req, res) {
        res.render("home", 
            {
                user: req.user.user
            }
    )
    }

    //search
    search(req, res) {
        res.render('search');
    }
}


module.exports = new HomeController();
