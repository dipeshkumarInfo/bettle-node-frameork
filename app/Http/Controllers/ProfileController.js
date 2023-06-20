const WithLayout = require(fconf('CORE:http:middleware')+ '/ViewTemplatingMiddleware');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');

const _dirname = 'Profile';

const View = async (req,resp) => {

    const myId =  req.user.id;

    let userId = myId;
    
    if(req.query.userId && req.query.userId !="")
    {
        userId = req.query.userId;
    }
    
    const usersDtl = await UsersResponse.usersById({_id: userId});

    resp.render(_dirname + '/index', WithLayout({ 
            title:"My Profile", 
            alert_message: req.flash('alert_message'),
            user: usersDtl.result,
            myId: myId,
        }, 
        {upermisions : req.permisions}    
    ));
}

module.exports = {
    View
}