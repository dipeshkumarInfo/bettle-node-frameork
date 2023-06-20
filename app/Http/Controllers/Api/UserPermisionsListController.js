const User =  require(fconf('CORE:app:models')+ '/UsersModel');
const mongoose = require('mongoose');


const userRolesAndPermisionsResult = async (req, res) => {

  const userId = req.params.userid;
  let byId= {};

  if(userId)
  {
    byId = { _id: mongoose.Types.ObjectId(userId) }
  }

  await User.aggregate([
    {
      $match: byId
    },
    {
      $unwind: "$roles",
    },
    {
      $group: {
        _id: "$roles",
        count: { $sum: 1 },
        users: { 
          $push: {  
            email: "$email", 
            _id: "$_id", 
            profileId: "$profile",
            profile: null
          } 
        }, // Adds the emails and profileIds of the users to each role object
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "_id",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: "$role",
    },
    {
      $lookup: {
        from: "permissions",
        localField: "role.permissions",
        foreignField: "_id",
        as: "permissions",
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "users.profileId",
        foreignField: "_id",
        as: "profiles",
      },
    },
    {
      $project: {
        roleName: "$role.name",
        roleLabel: "$role.label",
        permissionNames: "$permissions.name",
        count: 1,
        users: 1,
        profiles: 1,
      },
    },
    {
      $addFields: {
        users: {
          $map: {
            input: "$users",
            as: "user",
            in: {
              $mergeObjects: [
                "$$user",
                {
                  profile: {
                    $arrayElemAt: [
                      { $filter: { input: "$profiles", as: "profile", cond: { $eq: [ "$$profile._id", "$$user.profileId" ] } } },
                      0
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        roleName: 1,
        roleLabel: 1,
        permissionNames: 1,
        count: 1,
        users: 1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};


module.exports = {
  userRolesAndPermisionsResult
};
