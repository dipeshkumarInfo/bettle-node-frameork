const WithLayout = require(fconf('CORE:http:middleware')+ '/ViewTemplatingMiddleware');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');
const PermissionsResponse = require(fconf('CORE:http:responses')+ '/Permissions');

const View = async (req,resp) => {

    const users = await UsersResponse.usersList({}, false)
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
      .select("_id status");

    const rolesCount = await RoleResponse.rolesList().countDocuments({});
    const permissionsCount = await PermissionsResponse.permissionsList().countDocuments({});

    resp.render('dashboard', WithLayout({
        title:"Dashboard | connectMe",  
        alert_message: req.flash('alert_message'),
        users: users,
        rolesCount: rolesCount,
        permissionsCount: permissionsCount
    },
    {upermisions : req.permisions }
    ));
}

module.exports = {
    View
}