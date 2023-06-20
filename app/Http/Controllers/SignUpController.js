const UserRoles = require(fconf('CORE:app:models') + "/UserRolesModel");
const { CreateAccount, UpdateAccount } = require(fconf('CORE:controllers:api')+ '/AccountWithCommonDetailCreateController');
const PermissionsApi = require(fconf('CORE:controllers:api')+ '/PermissionsController');
const RolesEnum = require(fconf('CORE:app:enum')+ "/RolesEnum");
const PermisionsEnum = require(fconf('CORE:app:enum')+ "/PermisionsEnum");
const RoleResponse = require(fconf('CORE:http:responses')+ '/Roles');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');

const View = async (req, resp) => {

  let selectRoles = false;

  if(req.query.uid)
  {
    const checkPermission = await PermissionsApi.permissionsCheckByUserId(req.query.uid, [PermisionsEnum.USERS_CREATE]);

    if(checkPermission.status == true)
    {
      selectRoles = true;
    }
  }

  const roles = await RoleResponse.rolesList().sort({ name: 1 });
  resp.render(`signup`, 
  { 
    title: "SignUp Account | connectMe", 
    MainScriptShow: false, 
    alert_message: req.flash('alert_message'), 
    roles: roles,
    user : {},
    formUrl: '',
    rolesDropdown: selectRoles,
    formDefaultValue: 
    { 
      name: req.flash("name"), 
      email: req.flash("email"), 
      mobile_number: req.flash("mobile_number"), 
      pin: req.flash("pin"),
    } 
  });
}


const Create = async (req, res) => {

  try {
    
    const { name, mobile_number, email, pin } = req.body;

    let roleName = RolesEnum.USERS;
    if(req.body && req.body.roleValue)
    {
      roleName = req.body.roleValue;
    }

    const roleId = await RoleResponse.rolesByName(roleName);

    if(roleId.status == false)
    {
      req.flash('alert_message', [{ msg: "Roles Not Availiable Please Contact Administrator", type: 'danger' }]);
      flashPrependValues(req, res, name, mobile_number, email, pin);
      return res.redirect(base_path + 'signup');
    }

    const response = await CreateAccount(req, roleId.result._id);

    if(!(response && response.status))
    {
      req.flash('alert_message', [{ msg: response.msg, type: 'danger' }]);
      flashPrependValues(req, res, name, mobile_number, email, pin);
      return res.redirect(base_path + 'signup');
    }

    req.flash('alert_message', [{ msg: response.msg , type: 'success' }]);
    return res.redirect(base_path + 'login');

  } catch (err) {

    req.flash('alert_message', [{ msg: err.message, type: 'danger' }]);
    return res.redirect(base_path + 'signup');
  
  }
}


const Edit = async (req, resp) => {

  const userId = req.params.id;
  const queryUserId = req.query.uid;

  if(queryUserId)
  {
    const checkPermission = await PermissionsApi.permissionsCheckByUserId(queryUserId, [PermisionsEnum.USERS_UPDATE]);

    if(checkPermission.status == false)
    {
      req.flash('alert_message', [{ msg: "You Don't have Permission to edit.", type: 'danger' }]);
      return resp.redirect(base_path + 'signup');
    }
  }else{
    req.flash('alert_message', [{ msg: "You Can't Edit.", type: 'danger' }]);
    return resp.redirect(base_path + 'signup');
  }

  const userDtl = await UsersResponse.usersById({_id: userId});

  resp.render(`signup`, 
  { 
    title: "SignUp Account | connectMe", 
    MainScriptShow: false, 
    alert_message: req.flash('alert_message'), 
    user : userDtl.result,
    rolesDropdown: false,
    formUrl : `${base_path}signup/${userDtl.result._id}/update?uid=${queryUserId}`,
    formDefaultValue: 
    { 
      name: userDtl.result.profile.name, 
      email: userDtl.result.profile.email, 
      mobile_number: userDtl.result.profile.mobile_number, 
      pin: '',
    } 
  });
}

const Update = async (req, res) => {

  try {
    
    const { name, mobile_number, email, pin } = req.body;
    const userId = req.params.id;

    const userDtl = await UsersResponse.usersById({_id: userId});
    const response = await UpdateAccount(req, userDtl);

    if(!(response && response.status))
    {
      req.flash('alert_message', [{ msg: response.msg, type: 'danger' }]);
      flashPrependValues(req, res, name, mobile_number, email, pin);
      return res.redirect(base_path + 'signup');
    }

    req.flash('alert_message', [{ msg: response.msg , type: 'success' }]);
    return res.redirect(base_path + 'login');

  } catch (err) {

    req.flash('alert_message', [{ msg: err.message, type: 'danger' }]);
    return res.redirect(base_path + 'signup');
  
  }
}

const flashPrependValues = (req, res, name, mobile_number, email, pin) => {
  req.flash('email', email);
  req.flash('name', name);
  req.flash('mobile_number', mobile_number);
  req.flash('pin', pin);

  return req;
}


module.exports = {
  View,
  Edit,
  Create,
  Update
};