const WithLayout = require(fconf('CORE:http:middleware')+ '/ViewTemplatingMiddleware');

const _dirname = 'Errors';

const FourHundredThree = (req,resp) => {
   
    resp.render(_dirname + '/index', WithLayout({ title: "Access Forbidden | connectMe", alert_message: req.flash('alert_message'), statusCode : 403}, {upermisions : req.permisions} )) ;
}

const FourHundredFour = (req,resp) => {
   
    resp.render(_dirname + '/index', { title: "Page Not Found | connectMe", alert_message: req.flash('alert_message'), statusCode : 404 } ) ;
}

const FiveHundred = (req,resp) => {
   
    resp.render(_dirname + '/index', { title: "Access Forbidden | connectMe", alert_message: req.flash('alert_message'), statusCode : 500 } ) ;
}

module.exports = {
    FourHundredThree,
    FourHundredFour,
    FiveHundred
}