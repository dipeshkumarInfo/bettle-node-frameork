const WithLayout = require(fconf('CORE:http:middleware') + '/ViewTemplatingMiddleware');
const Users = require(fconf('CORE:app:models') + '/UsersModel');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');
const { DeleteAccount } = require(fconf('CORE:controllers:api')+ '/AccountWithCommonDetailCreateController');
const { userDetailById } = require(fconf('CORE:controllers:api')+ '/GetUserProfileDetailController');

const _dirname = 'Users';

const View = async (req, resp, next) => {
  try {
    var perPage = 10;
    var page = req.query.page || 1;
    
    const roleExclude = await RoleResponse.NotInRole();

    UsersResponse.usersList()
      .sort({ name: 1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate({
        path: 'profile',
        select: 'name',
      })
      .populate({
        path: 'roles',
        select: 'name label',
        match: { name: { $ne:  roleExclude } },
        options: { sort: { name: 1 } }
        })
      .exec(function (err, userss) {
        Users.count().exec(function (err, count) {
          if (err) return next(err);

           const filteredUsers = userss.filter(user => user.roles.length > 0);
    
            resp.render(_dirname + '/index', WithLayout({ 
              title: "Users", 
              alert_message: req.flash('alert_message'), 
              users: filteredUsers, 
              userId : req.user.id,
              current: page, 
              pages: Math.ceil(count / perPage) }, 
              {upermisions : req.permisions})
            );
        })
    });

  } catch (err) {
    return resp.status(500).json({  msg: err.message, status: false });
  }

}

const Add = async (req, resp) => {
    resp.render(_dirname + '/add', WithLayout({ 
      title: "Users | connectMe", 
      alert_message: req.flash('alert_message'), 
      user : {},
      formUrl: '',
      reset: true
     }, {upermisions : req.permisions}));
}

const Delete = async (req, res) => {

  try {

      // Role Id
      const userId = req.params.id

      // Validate inputs
      if (!(userId)) {
        return res.status(400).json({ msg: 'Role id Required', status: false });
      }

      const response = await DeleteAccount(userId);

      if(!(response && response.status))
      {
        return res.status(400).json({ msg: 'Data Not Deleted Please Try Again.', status: false });
      } else {
        return res.status(200).json({ msg: 'Successfully User Detail Deleted', status: true });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}

const LoggedUserDetail = async (req, res) => {

  try{

    const response = await userDetailById(req.user.id);

    if(!(response && response.status))
    {
      return res.status(400).json({ msg: 'Data Not Deleted Please Try Again.', status: false });
    } else {
      return res.status(200).json({ msg:  'Your Detail Fetched', result : response.result, status: true });
    }
  }
  catch (err) {
      return res.status(500).json({  msg: err.message, status: false });
  }

}

module.exports = {
    View,
    Add,
    Delete,
    LoggedUserDetail
}