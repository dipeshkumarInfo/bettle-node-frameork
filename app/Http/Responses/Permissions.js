const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');

const permissionsList = () => {
  return Permissions.find({ status:1 });
}

const permisionById = (permissionId) => {
    try {

          const detail = async () => {
            const response = await Permissions.findOne({ _id: permissionId, status: 1 }).select('name label description');
  
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

  const storePermissions = (dataSet) => {
    try {

          const detail = async () => {
            // Create Permissions in our database
            const data = await new Permissions(dataSet);

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

  const updatePermissionsById = (permissionId, dataSet) => {
    try {

          const detail = async () => {
              const response = await Permissions.updateOne({ _id: permissionId }, { $set: dataSet });
    
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

  const deletePermissionById = (permissionId) => {
    try {

          const detail = async () => {
            const response = await Permissions.deleteOne({ _id: permissionId });
    
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
  
  module.exports = {
    permissionsList,
    permisionById,
    storePermissions,
    updatePermissionsById,
    deletePermissionById
  }