class NewController{
    //GET /news
    index(req, res){
        res.render("news")
    }

    show(req, res){
        res.send("Something!!!")
    }



}

module.exports = new NewController