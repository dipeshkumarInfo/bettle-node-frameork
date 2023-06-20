const WithLayout = require(fconf('CORE:http:middleware') + '/ViewTemplatingMiddleware');
const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');
const PermissionsResponse = require(fconf('CORE:http:responses')+ '/Permissions');


const _dirname = 'Permissions';

const View = async (req, resp, next) => {
  try {
    var perPage = 10;
    var page = req.query.page || 1;

    PermissionsResponse.permissionsList()
      .sort({ name: 1 })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, permissionss) {
        Permissions.count().exec(function (err, count) {
          if (err) return next(err);
    
            resp.render(_dirname + '/index', WithLayout({ 
              title: "Permissions", 
              alert_message: req.flash('alert_message'), 
              permissions: permissionss, 
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
      permission : {},
      formUrl: '',
      reset: true
     }, {upermisions : req.permisions}));
}

const Store = async (req, res) => {

  try {
      // Get user input
      const { name, label, description } = req.body;

      // Validate inputs
      if (!(name && label && description)) {
        return res.status(400).json({ msg: 'All Fields Required', status: false });
      }
      
      const permission = await PermissionsResponse.storePermissions({
        creator: req.user.id,
        name: name,
        label,
        description,
        status: 1,
        creator: req.user.id
      });

      if (permission.status) {
        return res.status(200).json({ msg: 'Successfully Permissions Detail Submited', status: true });
      } else {
        return res.status(400).json({ msg: 'Data Not Saved Please Try Again.', status: false });
      }
    }
    catch (err) {
        return res.status(500).json({  msg: err.message, status: false });
    }
}


const Edit = async (req, resp) => {

  const permissionId = req.params.id
  const permissionDtl = await PermissionsResponse.permisionById(permissionId);

  resp.render(_dirname + '/add', WithLayout({ 
    title: "Edit Permissions", 
    alert_message: req.flash('alert_message'), 
    permission : permissionDtl.result,
    formUrl : `${base_path}permissions/${permissionDtl.result._id}/update`,
    reset: false
   }, {upermisions : req.permisions}));
}


const Update = async (req, res) => {

  try {

      // Permission Id
      const permissionId = req.params.id

      // Get user input
      const { name, label, description } = req.body;

      // Validate inputs
      if (!(name && label && description)) {
        return res.status(400).json({ msg: 'All Fields Required', status: false });
      }

      const data = await PermissionsResponse.updatePermissionsById(permissionId,  { 
        name,
        label, 
        description,
        creator: req.user.id
      });

      if (data.status) {
        return res.status(200).json({ msg: 'Successfully Permission Detail Updated', status: true });
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

      // Permission Id
      const permissionId = req.params.id

      // Validate inputs
      if (!(permissionId)) {
        return res.status(400).json({ msg: 'Permission id Required', status: false });
      }

      const data = await PermissionsResponse.deletePermissionById(permissionId);

      if (data.status) {
        return res.status(200).json({ msg: 'Successfully Permissions Detail Deleted', status: true });
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