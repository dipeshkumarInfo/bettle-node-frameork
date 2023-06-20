const WithLayout = require(fconf('CORE:http:middleware') + '/ViewTemplatingMiddleware');
const Roles = require(fconf('CORE:app:models') + '/UserRolesModel');
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');
const PermissionsResponse = require(fconf('CORE:http:responses')+ '/Permissions');

const _dirname = 'PermissionsToRoles';

/**************************  Permissions To Roles **************************/
const View = async (req, resp, next) => {
  try {
    var perPage = 10;
    var page = req.query.page || 1;

    RoleResponse.rolesList()
      .sort({ name: 1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate({
        path: 'permissions',
        select: 'name label',
        options: { sort: { name: 1 } }
      })
      .exec(function (err, roless) {
        Roles.count().exec(function (err, count) {
          if (err) return next(err);
    
            resp.render(_dirname + '/index', WithLayout({ 
              title: "Roles & Permission", 
              alert_message: req.flash('alert_message'), 
              roles: roless, 
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
    const permissions = await PermissionsResponse.permissionsList();
    const roles = await RoleResponse.rolesList();

    resp.render(_dirname + '/add', WithLayout({ 
      title: "Classes | connectMe", 
      alert_message: req.flash('alert_message'), 
      permissions: permissions,
      roles : roles,
      rolePermission: {},
      formUrl: '',
      reset: false
     }, {upermisions : req.permisions}));
}

const Store = async (req, res) => {

  /* For Update or Edit Not needed Specific Role id we can use Store for store and udate also */
  try {
      // Get user input
      const { permissions, roles } = req.body;

      const roleDtl = await RoleResponse.PermissionToRolesAttached(permissions, roles);

      if (roleDtl.status) {
        return res.status(200).json({ msg: roleDtl.result, status: true });
      } else {
        return res.status(400).json({ msg: roleDtl.result, status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}

const Edit = async (req, resp) => {

  const roleId = req.params.id
  const roleDtl = await RoleResponse.multyRolesById(roleId);
  const roleDtlFirst = await RoleResponse.rolesById(roleId);
  const permissions = await PermissionsResponse.permissionsList();

  resp.render(_dirname + '/add', WithLayout({ 
    title: "Edit Permissions To Roles", 
    alert_message: req.flash('alert_message'),
    script: '<script src="/js/RolePermission/common.js"></script>', 
    roles : roleDtl.result,
    rolePermission : roleDtlFirst.result,
    permissions: permissions,
    formUrl : `${base_path}assign/permissions-to-roles/add`,
    reset: false
   }, {upermisions : req.permisions}));
}

/**************************  Permissions To Roles **************************/
module.exports = {
    View,
    Add,
    Store,
    Edit
}