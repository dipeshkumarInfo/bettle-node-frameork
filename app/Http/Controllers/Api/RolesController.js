const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');
const UserRoles = require(fconf('CORE:app:models') + '/UserRolesModel');
const Users = require(fconf('CORE:app:models') + '/UsersModel');

const updatePermissionByRoleId = async (roleid, permisionName) => {
    try {

    const roleValidate = await UserRoles.findOne({_id : roleid});

    if(!roleValidate)
    {
      return { msg: "Invalid Role.", status: false };
    }

    const permissions = await Permissions.find({ name : { $in: permisionName }, "status": 1 }).exec();
    const permissionsId = permissions.map(prm => prm._id);

      if(permissionsId.length == 0)
      {
        return { msg: "Invalid Permission.", status: false };
      }
      
        const response = await UserRoles.updateMany({ _id: roleid , permissions: { $ne: permissionsId } }, { permissions: permissionsId });

        if (!response) {
            return { msg : response , status: false };
        } else {
            return { msg : "Permission Attached With Role" , status: true };
        }
     
  } catch (error) {
      return { msg : error.message , status: false };
  }
  }

  const AttachAllPermissionToRoleById = async (roleid) => {
    try {
     
    const roleValidate = await UserRoles.findOne({_id : roleid});

    if(!roleValidate)
    {
      return { msg: "Invalid Role.", status: false };
    }

    const permissions = await Permissions.find({ "status": 1 }).exec();
    const permissionsId = permissions.map(prm => prm._id);

      if(permissionsId.length == 0)
      {
        return { msg: "Invalid Permission.", status: false };
      }
      
        const response = await UserRoles.updateMany({ _id: roleid , permissions: { $ne: permissionsId } }, { permissions: permissionsId });

        if (!response) {
            return { msg : response , status: false };
        } else {
            return { msg : "Permission Attached With Role" , status: true };
        }
     
  } catch (error) {
      return { msg : error.message , status: false };
  }
  }

  const rolesList = async (req, res) => {
    try {
          const id = req.params.roleid;
          let idJson = {};
          if(id)
          {
            idJson = {_id: id}
          }

          const response = await UserRoles.find(idJson).populate('permissions', 'name label');
  
          if (!response) {
            return res.status(500).json({ msg : response , status: false });
          } else {
            return res.status(200).json({ msg : response , status: true });
          }

    } catch (error) {
        return res.status(500).json({ msg : error.message , status: false });
    }
  }

  const userRolesByRolesId = async (req, res) => {
    try {
          const { rolesId } = req.body;
   
          const response = await Users.find({roles: { $in: rolesId.split(",") } }).populate('roles', 'name label');
  
          if (!response) {
            return res.status(500).json({ msg : response , status: false });
          } else {
            return res.status(200).json({ msg : response , status: true });
          }

    } catch (error) {
        return res.status(500).json({ msg : error.message , status: false });
    }
  }


  const rolesAndPermissionChecks = async (req, arrRoles, arrPermissions) => {
    
    const requiredRoles = [...arrRoles, /* supreme_admin */];
    const requiredPermissions = [...arrPermissions];
  
      try {
        // Find the user's roles and populate the permissions
        const user = await User.findById(req.user.id).populate('roles', 'name permissions');

        // Extract the role names and permissions from the user's roles
        const userRoles = user.roles.map(role => role.name);
        const userPermissions = user.roles.flatMap(role => role.permissions);

        // Check if the user has the required roles and permissions
        const hasRequiredRoles = requiredRoles.some(role => userRoles.includes(role));
        const hasRequiredPermissions = requiredPermissions.some(permission => userPermissions.includes(permission));

        if (hasRequiredRoles && hasRequiredPermissions) {
            return { msg: `Proceed`, status: true };
        } else {
          return { msg: `You Don't Have Right Access to Access Page`, status: false };
        }
      } catch (error) {
        return { msg: 'Something Wrong ! '+ error.message, status: false };
      }
  };



  const updateRolesByUerId = async (req, res) => {
    try {      
        const { userId, rolesId } = req.body;

        const response = await Users.updateOne({ _id: userId }, { $set: { roles: rolesId.split(",") } } );

        if (!response) {
          return res.status(500).json({ msg : response , status: false });
        } else {
          return res.status(200).json({ msg : "Roles Attached With This User" , status: true });
        }
     
  } catch (error) {
    return res.status(500).json({ msg : error.message , status: false });
  }
  }

  const getUserRolesName = async (userId) => {
    try {

      const response = await Users.find({_id: userId }).populate('roles', 'name label');

      if (!response) {
        return res.status(500).json({ msg : response , status: false });
      } else {
        return res.status(200).json({ msg : response , status: true });
      }

    } catch (error) {
      return res.status(500).json({ msg : error.message , status: false });
    }
  }

  module.exports = {
    rolesList,
    updatePermissionByRoleId,
    userRolesByRolesId,
    updateRolesByUerId,
    rolesAndPermissionChecks,
    AttachAllPermissionToRoleById,
    getUserRolesName
  }