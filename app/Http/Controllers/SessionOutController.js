const bcrypt = require('bcryptjs');
const generateToken = require(fconf('CORE:app:helpers')+ "/GenerateTokenHelper");
const User = require(fconf('CORE:app:models')+ "/UsersModel");

const View = async (req, resp)  => {
    resp.render('sessionOut', { _token: req.params._token, alert_message: req.flash('alert_message'), remainingLimit: req.flash('remainingLimit'), title: "Verify , Its You ?"});
}

const Update = async (req, resp) => {
    const { _token, pin } = req.body;

    const remainingLimit = req.rateLimit.remaining;

    const user = await User.findOne({ _token });

    if (user && (await bcrypt.compare(pin, user.pin))) {
        const token = generateToken(user._id);
        let data = await User.updateOne({ _token }, { $set: { _token: token, loggedIn: 1 } });

        req.session.userToken = token;
        // req.session.userId = user._id;
        
        const redirectUrl = req.session.redirect_url;

        req.flash('alert_message',[{msg:'Login Successfully',type:'success'}]);

        req.session.redirect_url = undefined;

        return resp.redirect(redirectUrl || '/dashboard');
    }

    req.flash('alert_message',[{msg:'Your Entered PIN is Incorrect Plese Try Again.',type:'danger'}]);
    req.flash('remainingLimit',[{msg:`Only ${(remainingLimit+1)} More Request Remain`,type:'danger'}]);

    return resp.redirect('/session-out/'+_token);
}


module.exports = {
    View,
    Update
};