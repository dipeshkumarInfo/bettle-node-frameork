const WithLayout = require(fconf('CORE:http:middleware') + '/ViewTemplatingMiddleware');
const Roles = require(fconf('CORE:app:models') + '/UserRolesModel');
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');

const _dirname = 'Roles';

const View = async (req, resp, next) => {
  try {
    var perPage = 10;
    var page = req.query.page || 1;

    RoleResponse.rolesList()
      .sort({ name: 1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      // .populate({
      //   path: 'permissions',
      //   select: 'name label',
      //   options: { sort: { name: 1 } }
      // })
      .exec(function (err, roless) {
        Roles.count().exec(function (err, count) {
          if (err) return next(err);
    
            resp.render(_dirname + '/index', WithLayout({ 
              title: "Roles", 
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
    resp.render(_dirname + '/add', WithLayout({ 
      title: "Classes | connectMe", 
      alert_message: req.flash('alert_message'), 
      role : {},
      formUrl: '',
      reset: true
     }, {upermisions : req.permisions}));
}

const Store = async (req, res) => {

  try {
      // Get user input
      const { name, label } = req.body;

      // Validate inputs
      if (!(name && label)) {
        return res.status(400).json({ msg: 'All Fields Required', status: false });
      }

      const roles = await RoleResponse.storeRoles({
        creator: req.user.id,
        name: name,
        label,
        status: 1,
        creator: req.user.id
      });

      if (roles.status) {
        return res.status(200).json({ msg: 'Successfully Roles Detail Submited', status: true });
      } else {
        return res.status(400).json({ msg: 'Data Not Saved Please Try Again.', status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}


const Edit = async (req, resp) => {

  const roleId = req.params.id
  const roleDtl = await RoleResponse.rolesById(roleId);

  resp.render(_dirname + '/add', WithLayout({ 
    title: "Edit Roles", 
    alert_message: req.flash('alert_message'), 
    role : roleDtl.result,
    formUrl : `${base_path}roles/${roleDtl.result._id}/update`,
    reset: false
   }, {upermisions : req.permisions}));
}


const Update = async (req, res) => {

  try {

      // Role Id
      const roleId = req.params.id

      // Get user input
      const { name, label } = req.body;

      // Validate inputs
      if (!(name && label)) {
        return res.status(400).json({ msg: 'All Fields Required', status: false });
      }

      const data = await RoleResponse.updateRolesById(roleId,  { 
        name,
        label, 
        creator: req.user.id
      });

      if (data.status) {
        return res.status(200).json({ msg: 'Successfully Roles Detail Updated', status: true });
      } else {
        return res.status(400).json({ msg: 'Data Not Saved Please Try Again.', status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}

const Delete = async (req, res) => {

  try {

      // Role Id
      const roleId = req.params.id

      // Validate inputs
      if (!(roleId)) {
        return res.status(400).json({ msg: 'Role id Required', status: false });
      }

      const data = await RoleResponse.deleteRolesById(roleId);

      if (data.status) {
        return res.status(200).json({ msg: 'Successfully Roles Detail Deleted', status: true });
      } else {
        return res.status(400).json({ msg: 'Data Not Saved Please Try Again.', status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}

module.exports = {
    View,
    Add,
    Store,
    Edit,
    Update,
    Delete
}