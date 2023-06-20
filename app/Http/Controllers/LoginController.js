const bcrypt = require('bcryptjs');
const generateToken = require(fconf('CORE:app:helpers')+ "/GenerateTokenHelper");
const User = require(fconf('CORE:app:models')+ "/UsersModel");

const View = (req, resp) => {
  if(req.session.userToken)
  {
    return resp.redirect('/dashboard');
  }
  resp.render(`login`, { title: "Login Account | connectMe", alert_message: req.flash('alert_message'),remainingLimit: req.flash('remainingLimit'), MainScriptShow:false });
}

const Authenticate = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const remainingLimit = req.rateLimit.remaining;

    if (!(email && password)) {
      req.flash('alert_message',[{msg:'Email and password input is required',type:'danger'}]);
      return res.redirect("..");
    }

    const user = await User.findOne({ email, status: 1 });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      if (user.loggedIn >= 1) {
        req.flash('alert_message',[{msg:'You are already Logged in Somewhere to reset session Enter Your Pin',type:'danger'}]);
        return res.redirect('/session-out/' + user._token);
      }

      const token = generateToken(user._id);

      let data = await User.updateOne({ email }, { $set: { _token: token, loggedIn: 1 } });

      if (data.modifiedCount >= 1) {
        // return res.status(200).json({Message:"Login Successfully",status:true,_token:token});
        req.session.userToken = token;
        // req.session.userId = user._id;

        const redirectUrl = req.session.redirect_url;

        req.flash('alert_message',[{msg:'Login Successfully',type:'success'}]);
        req.session.redirect_url = undefined;

        return res.redirect(redirectUrl || '/dashboard');
      }
      req.flash('alert_message',[{msg:'Something Wrong Please Try Again.',type:'danger'}]);
      return res.redirect('..');
    }

    req.flash('alert_message',[{msg:'Invalid Credentials',type:'danger'}]);
    req.flash('remainingLimit',[{msg:`Only ${(remainingLimit+1)} More Login Try Reamin`,type:'danger'}]);
    
    return res.redirect('..');

  } catch (err) {
    req.flash('alert_message',[{msg:err,type:'danger'}]);
    return res.redirect('..');
  }
}


const Logout = async (req, res, next) => {
  let data = await User.updateOne({ _token: req.session.userToken }, { $set: { loggedIn: 0 } });
  if (data.acknowledged) {
    req.session.userToken = null;
  }
  
  if (req.session) {
      // delete session object
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        } else {
          // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          return res.redirect('/');
        }
      });
  }
}


module.exports = {
  View,
  Authenticate,
  Logout
};