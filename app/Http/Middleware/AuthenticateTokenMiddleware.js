const CheckToken = require(fconf('CORE:http:middleware') + '/CheckTokenMiddleware');

const redirectToBase = (req, res, next) => {
  try{

  let paramStatus = false ;
  if(proceedTo(req))
  {
    paramStatus = true;
  }

  const responseAccordingly = (resp) => {
    if (paramStatus) {
      return res.status(401).json({ status: false, result: resp });
    }
    req.flash('alert_message', [{ msg: resp, type: 'danger' }]);
    req.session.redirect_url = req.originalUrl;
    return res.redirect('/');
  }


  CheckToken(req, res, paramStatus)
    .then(function (data) {
      if (data === true) {
        next()
      }
      else {
        responseAccordingly("UnVerfied Credentials");
      }
    })
    .catch(function (error) {
      responseAccordingly("Unauthorized or Invalid Token");
    });
  }
  catch(error)
  {
    responseAccordingly("Unauthorized !" + error.message);
  }
}

module.exports = redirectToBase;