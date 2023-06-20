const { permissionsCheckByUserId, permisionsByUserId } = require(fconf('CORE:controllers:api') + '/PermissionsController');

const authPermissionsMiddleware = (requiredPermissions, responseType = "") => {
  return async (req, res, next) => {
    
    let apiUrlResponse = false ;
    if(proceedTo(req))
    {
      apiUrlResponse = true;
    }

    try {
      const userId = req.user.id;
      const result  = await permissionsCheckByUserId(userId, requiredPermissions);

      if(result.status)
      {
        next();
      }else{
        if(apiUrlResponse || responseType == "json")
        {
          return res.status(403).json({ msg: 'You Do Not have Permission To Access Data', status: false });
        }
        req.flash('alert_message',[{msg:`You Don't Have Right Access to Access Page`,type:'danger'}]);
        return res.redirect(base_path + "error/access-forbidden/403");
      }
    }
    catch (error) {
      if(apiUrlResponse || responseType == "json")
      {
        return res.status(500).json({ msg: 'Something Wrong ! '+ error, status: false });
      }
      req.flash('alert_message',[{msg:'Something Wrong ! '+ error,type:'danger'}]);
      return res.redirect(base_path + "error/access-forbidden/403");
  }

  };
}

const hasPermission = async (requiredPermissions, userId, booleanResponse = false) => {

  const result  = await permissionsCheckByUserId(userId, requiredPermissions);

  if(booleanResponse === true)
  {
      return result.status;
  }

  if(result.status)
  {
      return {creator : userId };
  }

  return {};
}

const getUserPermisions = async (req, resp, next) => {
  try{
    const upermisions = await permisionsByUserId(req.user.id);

    if(upermisions.status)
    {
      req.permisions = upermisions.permisions || [];
      next();
    }else{
      req.flash('alert_message', [{ msg: upermisions.msg, type: 'danger' }]);
      return resp.redirect('/');
    }

  }catch(error)
  {
    req.flash('alert_message', [{ msg: "Somethong Wrong! Please Login Again."+ error.message, type: 'danger' }]);
    return resp.redirect('/');
  }
}

module.exports =  { authPermissionsMiddleware, hasPermission, getUserPermisions };