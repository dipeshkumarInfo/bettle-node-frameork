const jwt = require('jsonwebtoken');
const User = require(fconf('CORE:app:models') + "/UsersModel");
const Roles = require(fconf('CORE:app:models') + "/UserRolesModel");
const RolesEnum = require(fconf('CORE:app:enum')+ "/RolesEnum");

const CheckToken = (req, res, api = false) => {

  return new Promise(async function (resolve, reject) {
    try{
        let token = null;

        if (api === true) {
          const authHeader = req.headers['authorization'];
          token = authHeader && authHeader.split(' ')[1];

          const userCheck = await User.findOne({ _token: token }).populate('roles');
          if(!(userCheck && userCheck.roles.some(name => name.name == RolesEnum.SUPREME_ADMIN_ROLE_NAME )))
          {
            token = null;
            reject(false);
          }
        }
        else {
          token = req.session.userToken;
        }

        if (token == null) {
          reject(false);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            reject(false);
          } else {
            req.user = user
            resolve(true);
          }
        });

      } catch (error) {
        reject(error.message);
      }
  });
}

module.exports = CheckToken;