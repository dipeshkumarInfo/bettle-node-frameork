const mongoose = require('mongoose');
const User =  require(fconf('CORE:app:models')+ '/UsersModel');
const Profile = require(fconf('CORE:app:models') + "/ProfileModel");
const roles = require(fconf('CORE:app:models')+ "/UserRolesModel");
const Permissions = require(fconf('CORE:app:models')+ "/PermissionsModel");
const PermisionsEnum = require(fconf('CORE:app:enum')+ "/PermisionsEnum");

//const supreme_admin = PermisionsEnum.SUPREME_ADMIN_ROLE_NAME;

const userDetailsById = async (req, res) => {
/* This Will Give How many user have roles with counts */
    try{
        const id = req.params.id;
          let idJson = {};
          if(id)
          {
            idJson = {_id: id}
          }
    
        await User.find(idJson)
        .populate({
            path: 'profile'
        })
      .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
          }
        })
        .exec(async (err, results) => {
    
            if (err) {
                return res.status(500).json({  msg: err.message, result : {}, status: false });
            }
    
            return res.status(200).json({  msg: 'User Details Fetched', result : results, status: true });
    
        });
    
        }catch(err)
        {
            return res.status(500).json({  msg: err.message, result : {}, status: false });
        }
}

const userDetailById = async (userId) => {
  try{
      const response =  await User.findOne({_id: userId})
      .select('_id')
      .populate({
          path: 'profile',
          select : "email name mobile_number"
      })
      .populate({
        path: 'roles',
        select: "permissions name label",
        populate: {
          path: 'permissions',
          select: "name label"
        }
      });

      if(response)
      {
        return {  msg: 'User Details Fetched', result : response, status: true };
      }

      return {  msg: "User Detail Fething Error !", result: {}, status: false };

    }
    catch(err)
    {
      return {  msg: err.message, result: {}, status: false };
    }
}


module.exports = {
    userDetailsById,
    userDetailById
};
