const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');
const UserRoles = require(fconf('CORE:app:models') + '/UserRolesModel');
const User = require(fconf('CORE:app:models') + '/UsersModel');

const updatePermissionById = async (permissionId, permisionKeyVals = {}) => {
    try {
     
        const response = await Permissions.updateOne({ _id: permissionId }, permisionKeyVals);

        if (!response) {
            return { msg : response , status: false };
        } else {
            return { msg : "Permission Updated" , status: true };
        }
     
  } catch (error) {
      return { msg : error.message , status: false };
  }
  }

  const permissionsList = async (req, res) => {
    try {
          const id = req.params.permissionid;
          let idJson = {};
          if(id)
          {
            idJson = {_id: id}
          }

          const response = await Permissions.find(idJson);
  
          if (!response) {
            return res.status(500).json({ msg : response , status: false });
          } else {
            return res.status(200).json({ msg : response , status: true });
          }

    } catch (error) {
        return res.status(500).json({ msg : error.message , status: false });
    }
  }

  
const permissionsCheckByUserId = async (userId, requiredPermissions) => {

  try {
    const upermisions = await permisionsByUserId(userId);
    const userPermissions = upermisions.permisions || [];

    // if(userRoles.includes(supreme_admin))
    // {
    //     return { msg: `Proceed`, status: true };
    // }
    // Check if the user has the required permissions
    const hasRequiredPermissions = await requiredPermissions.every(permission => userPermissions.includes(permission));

    if (hasRequiredPermissions) {      
      return { msg: `Proceed`, status: true };
    } else {
      return { msg: `You Don't Have Right Access to Access Page`, status: false };
    }
  } catch (error) {
    return { msg: 'Something Wrong ! '+ error.message, status: false };
  }
};
  
  const permisionsByUserId = async (userId) => {
    try{

      const user = await User.findById(userId)
        .populate({
          path: 'roles',
          select : "name permissions",
          populate: {
            path: 'permissions',
            select: "name"
          }
        });

        // Extract the role names and permissions from the user's roles
        const userPermissionsJoin = user.roles.flatMap(role => role.permissions);
        const userPermissions = userPermissionsJoin.flatMap(prm => prm.name);

        return { msg: `Successfully Fetched Details.`, status: true, permisions: userPermissions };
      
    }catch(error){
      return { msg: error.message, status: false };
    }
  }

  module.exports = {
    permissionsList,
    updatePermissionById,
    permissionsCheckByUserId,
    permisionsByUserId
  }