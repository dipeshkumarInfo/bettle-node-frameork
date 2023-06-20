const CheckToken = require('./vendor/autoload');
const app = CheckToken(__dirname);

const path = require('path');

/*  start : "Set Templating Engine for and with Layout" */
  const expressLayouts = require('express-ejs-layouts');
  app.use(expressLayouts);
  app.set('layout', 'Layout/index');
  app.set('views', path.join(__dirname, 'resources/views'));

  app.set("view engine", "ejs");
/* end */

/*  start : "Used Middleware, services and Helpers" */

// Middleware
  const AuthenticateUser = require(fconf('CORE:http:middleware') + '/AuthenticateTokenMiddleware');
  const preventBack = require(fconf('CORE:http:middleware') + '/PreventBackMiddleware');
  const { getUserPermisions } = require(fconf('CORE:http:middleware')+ "/AuthenticateRolesMiddleware");
  
  // Service Providers
  const { webHandleRoute, apiHandleRoute, byPassApiHandleRoute } = require(fconf('CORE:app:providers')+ '/RouteServiceProvider');

/*  end */


/* start : "Routings" */
  
  //Authentication Users Request
  app.post('/authValidate', (req, res) => {
    const CheckToken = require(fconf('CORE:http:middleware') + '/CheckTokenMiddleware');
    CheckToken(req, res)
      .then((data) => {
        return res.status(200).json({ msg: 'Verified User', status: true });
      })
      .catch((error) => {
        return res.status(401).json({ msg: 'Unauthorized User, Please Refresh Page for Login ', status: false });
      });
  });

  // Migration and Seeding
  app.use(`/:path(${api_url.join('|')})/by-pass`, (req, res, next) => { byPassApiHandleRoute(req, res, next, "/by-pass") });
  
  // -- API Section 
  app.use(`/:path(${api_url.join('|')})`, AuthenticateUser, (req, res, next) => { apiHandleRoute(req, res, next, "/index") });

  // -- Web Section

  // Login and Sign Up
  app.use('/', (req, res, next) => { webHandleRoute(req, res, next, "/login") });
  app.use('/session-out', (req, res, next) => { webHandleRoute(req, res, next, "/sessionOut") });
  app.use("/signup", (req, res, next) => { webHandleRoute(req, res, next, "/signup") });

  //Dashboard
  app.use('/dashboard', AuthenticateUser, preventBack, getUserPermisions, require(fconf('CORE:routes:web') + '/dashboard'));

  //Roles
  app.use('/roles', AuthenticateUser, preventBack, getUserPermisions, (req, res, next) => { webHandleRoute(req, res, next, "/roles") });

  //Permissions
  app.use('/permissions', AuthenticateUser, preventBack, getUserPermisions, (req, res, next) => { webHandleRoute(req, res, next, "/permissions") });

  //Assign Permissions To Roles
  app.use('/assign/permissions-to-roles', AuthenticateUser, preventBack, getUserPermisions, (req, res, next) => { webHandleRoute(req, res, next, "/permissions-to-roles") });

  //Assign Roles To Users
  app.use('/assign/roles-to-user', AuthenticateUser, preventBack, getUserPermisions, (req, res, next) => { webHandleRoute(req, res, next, "/roles-to-user") });

  //Users
  app.use('/users', AuthenticateUser, preventBack, getUserPermisions, (req, res, next) => { webHandleRoute(req, res, next, "/users") });

  //Profile
  app.use('/profile', preventBack, AuthenticateUser, getUserPermisions, require(fconf('CORE:routes:web') + '/profile'));

/* end */


/* start : "Other pages During Request Other Respons By Requets" */

  //Not Allowed or Not Access Route
  app.use('/error', AuthenticateUser, preventBack, getUserPermisions, require(fconf('CORE:routes:web') + '/errors'));

  // catch 404 and forward to error handler
  // app.use((req, res, next) => {
  //   const err = new Error('File Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  // define 500 error callback
  app.use((err, req, res, next) => {
    
    res.status(500);

    if (req.xhr || (typeof req.headers.accept != "undefined" && req.headers.accept.indexOf('json') > -1)) 
    {
      return res.send({ msg: err.message, status: false });
    }else{
      // req.flash('alert_message',[{msg:err.message ,type:'danger'}]);
      return res.send(err.message);
   }
});

/* end */

