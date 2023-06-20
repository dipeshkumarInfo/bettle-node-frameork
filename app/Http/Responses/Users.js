const Users = require(fconf('CORE:app:models') + '/UsersModel');
const { userDetailById } = require(fconf('CORE:controllers:api')+ '/GetUserProfileDetailController');

const usersList = (where  = {}, statusWithActive = true) => {
  let statusJson = {}
  if(statusWithActive == true)
  {
    statusJson = {status: 1};
  }
  return Users.find({ ...statusJson , ...where });
}

const usersById = (usersId) => {
  try {

        const detail = async () => {
          const response = await userDetailById(usersId);

          if(!(response && response.status))
          {
              return { result : response.result , status: false };
          } else {
              return { result : response.result , status: true };
          }
        }

        return detail();

  } catch (error) {
      return { result : error.message , status: false };
  }
}

const deleteUsersById = (userId) => {
  try {

      const detail = async () => {
        const response = await Users.deleteOne({ _id: userId });

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

const userFindById = async (userId) => {
  return await Users.findById(userId);
}

  
  module.exports = {
    usersList,
    usersById,
    deleteUsersById,
    userFindById
  }