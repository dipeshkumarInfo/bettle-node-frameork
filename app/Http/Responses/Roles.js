const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');
const UserRoles = require(fconf('CORE:app:models') + '/UserRolesModel');
const Users = require(fconf('CORE:app:models') + '/UsersModel');
const RolesEnum = require(fconf('CORE:app:enum')+ "/RolesEnum");

const NotInRole = async () => {
  return await RolesEnum.SUPREME_ADMIN_ROLE_NAME;
}

const rolesList = () => {
  return UserRoles.find({ status:1, name: { $ne: RolesEnum.SUPREME_ADMIN_ROLE_NAME } });
}

const rolesById = (rolesId) => {
    try {

          const detail = async () => {
            const response = await UserRoles.findOne({ _id: rolesId, status: 1, name: { $ne: RolesEnum.SUPREME_ADMIN_ROLE_NAME } })
            .populate({
              path: "permissions",
              select : "name label"
            })
            .select('name label');
  
            if (!response) {
                return { result : response , status: false };
            } else {
                return { result : response , status: true };
            }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }

  const multyRolesById = (rolesId) => {
    try {

          const detail = async () => {
            const response = await UserRoles.find({ _id: rolesId, status: 1, name: { $ne: RolesEnum.SUPREME_ADMIN_ROLE_NAME } }).select('_id name label');
  
            if (!response) {
                return { result : response , status: false };
            } else {
                return { result : response , status: true };
            }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }

  const rolesByName = (rolesName) => {
    try {

          const detail = async () => {

            if(rolesName == RolesEnum.SUPREME_ADMIN_ROLE_NAME)
            {
              return { result : "This Role Not Allowed" , status: true };
            }

            const response = await UserRoles.findOne({ 'name' : rolesName, status: 1 }).select('name label');
  
            if (!response) {
                return { result : response , status: false };
            } else {
                return { result : response , status: true };
            }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }

  const storeRoles = (dataSet) => {
    try {

          const detail = async () => {
            // Create Permissions in our database
            const data = await new UserRoles(dataSet);

            let response = await data.save();
            if (!response) {
                return { result : response , status: false };
            } else {
                return { result : response , status: true };
            }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }


  const updateRolesById = (roleId, dataSet) => {
    try {

          const detail = async () => {
              const response = await UserRoles.updateOne({ _id: roleId, name: { $ne: RolesEnum.SUPREME_ADMIN_ROLE_NAME } }, { $set: dataSet });
    
              if (!response) {
                  return { result : response , status: false };
              } else {
                  return { result : response , status: true };
              }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }

  const deleteRolesById = (rolesId) => {
    try {

          const detail = async () => {
            const response = await UserRoles.deleteOne({ _id: rolesId, name: { $ne: RolesEnum.SUPREME_ADMIN_ROLE_NAME } });
    
              if (!response) {
                  return { result : response , status: false };
              } else {
                  return { result : response , status: true };
              }
          }

          return detail();
  
    } catch (error) {
        return { result : error.message , status: false };
    }
  }

  const PermissionToRolesAttached = (permissions, roles) => {
    try{

      const detail = async () => {
        let process = false;
        let msg = 'Invalid Data';

        const allPermission = await Permissions.find({ _id: { $in: permissions } });
        const permissionsId = allPermission.map(p => p._id);

        const allRoles = await UserRoles.find({ _id: { $in: roles } });
        const rolesId = allRoles.map(r => r._id);

        for (var i=0; i < rolesId.length; i++) {

          const attach = await UserRoles.updateOne({ _id: rolesId[i] }, { permissions: permissionsId });

          if(attach)
          {
            process = true;
            msg = `Successfully Attaced Roles With Permissions.`;
          }else{
            process = false;
            msg = `Error with On This Role: ${role}`;
          }

          if(process == false)
          {
              break;
          }
        }

        return { result : msg , status: process };
    }

    return detail();

    } catch (error) {
      return { result : error.message , status: false };
    }
  }
  

  const RolesToUsersAttached = (roles, users) => {
    try{

      const detail = async () => {
        let process = false;
        let msg = 'Invalid Data';

        const allRoles = await UserRoles.find({ _id: { $in: roles } });
        const rolesId = allRoles.map(p => p._id);

        const allUsers = await Users.find({ _id: { $in: users } });
        const userId = allUsers.map(r => r._id);

        for (var i=0; i < userId.length; i++) {

          const attach = await Users.updateOne({ _id: userId[i] }, { roles: rolesId });

          if(attach)
          {
            process = true;
            msg = `Successfully Attaced Roles To Users.`;
          }else{
            process = false;
            msg = `Error with On This Role: ${role}`;
          }

          if(process == false)
          {
              break;
          }
        }

        return { result : msg , status: process };
    }

    return detail();

    } catch (error) {
      return { result : error.message , status: false };
    }
  }

  module.exports = {
    rolesList,
    rolesById,
    multyRolesById,
    rolesByName,
    updateRolesById,
    storeRoles,
    deleteRolesById,
    PermissionToRolesAttached,
    RolesToUsersAttached,
    NotInRole
  }