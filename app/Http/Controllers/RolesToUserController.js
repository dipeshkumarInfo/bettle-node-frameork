const WithLayout = require(fconf('CORE:http:middleware') + '/ViewTemplatingMiddleware');
const Users = require(fconf('CORE:app:models') + '/UsersModel');
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');
const PermissionsResponse = require(fconf('CORE:http:responses')+ '/Permissions');

const _dirname = 'RolesToUser';

/**************************  Roles To Users **************************/

const View = async (req, resp, next) => {
  try {
    const roleExclude = await RoleResponse.NotInRole();

    var perPage = 10;
    var page = req.query.page || 1;

    UsersResponse.usersList()
      .sort({ name: 1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate({
        path: 'profile',
        select: 'name email',
        options: { sort: { name: 1 } }
      })
      .populate({
        path: 'roles',
        select: 'name label',
        match: { name: { $ne:  roleExclude } },
        options: { sort: { name: 1 } }
      })
      .select("roles profile")
      .exec(function (err, userss) {
        Users.count().exec(function (err, count) {
          if (err) return next(err);
            
          const filteredUsers = userss.filter(user => user.roles.length > 0);

            resp.render(_dirname + '/index', WithLayout({ 
              title: "Users & Roles", 
              alert_message: req.flash('alert_message'), 
              users: filteredUsers, 
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

    const roleExclude = await RoleResponse.NotInRole();
    const roles = await RoleResponse.rolesList();
    const users = await UsersResponse.usersList()
      .populate({
        path: 'profile',
        select: 'name email',
        options: { sort: { name: 1 } }
      })
      .populate({
        path: 'roles',
        select: 'name label',
        options: { sort: { name: 1 } }
      })
      .select("roles profile");

    resp.render(_dirname + '/add', WithLayout({ 
      title: "Classes | connectMe", 
      alert_message: req.flash('alert_message'), 
      roles: roles,
      users : users,
      roleExclude: roleExclude,
      userById: {},
      formUrl: '',
      reset: true
     }, {upermisions : req.permisions}));
}

const Store = async (req, res) => {

  try {
      // Get user input
      const { roles, users } = req.body;

      const userDtl = await RoleResponse.RolesToUsersAttached(roles, users);

      if (userDtl.status) {
        return res.status(200).json({ msg: userDtl.result, status: true });
      } else {
        return res.status(400).json({ msg: userDtl.result, status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}


const Edit = async (req, resp) => {

  const userId = req.params.id
  
  const roleExclude = await RoleResponse.NotInRole();
  const users = await UsersResponse.usersList({_id: userId})
      .populate({
        path: 'profile',
        select: 'name email',
        options: { sort: { name: 1 } }
      })
      .populate({
        path: 'roles',
        select: 'name label',
        options: { sort: { name: 1 } }
      })
      .select("roles profile");

  const roles = await RoleResponse.rolesList();

  const userByIdFirst = await UsersResponse.usersById(userId);

  resp.render(_dirname + '/add', WithLayout({ 
    title: "Edit Roles To Users", 
    alert_message: req.flash('alert_message'), 
    script: '<script src="/js/RolePermission/common.js"></script>', 
    roles: roles,
    users: users,
    roleExclude: roleExclude,
    userById :userByIdFirst.result,
    formUrl : `${base_path}assign/roles-to-user/add`,
    reset: false
   }, {upermisions : req.permisions}));
}


/**************************  Roles To Users **************************/
module.exports = {
    View,
    Add,
    Store,
    Edit
}