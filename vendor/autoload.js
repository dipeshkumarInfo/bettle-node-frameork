module.exports = (dirname) => {

/* start : "Call Library for Config File Data" */
    var nconf = require('nconf');
/* end */


/* start : "Call .env and Config File" */
    require('dotenv').config();
    require('../config/global')(nconf, dirname);
/* end */


/* start : "Necessary Library [express,cookie-parser,path ] initialization" */
    const express = require("express");
    const cookieParser = require('cookie-parser'); // For CSRF Cookie parsing
    const app = express();
/* end */

/* start : "Path Helper initialization" */
    const path_render = require(fconf('CORE:app:helpers') + "/PathHelper");
/* end */


/* start : "Remember Things" */

    // #Set Response for Json Format or Form UrlEncode For Submition Data Response By body-parser

    // const bodyparser = require('body-parser');
    // app.use(bodyparser.json());
    // app.use(bodyparser.urlencoded({ extended: false }));

/* end */


/* start : "Set Response for Json Format or Form UrlEncode For Submition Data Response By Express" */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
/* end */

/* start : "Running PORT" */
    const PORT = nconf.any('CPORT', 'PORT'); //process.env.PORT || 8000;
/* end */

/* start : "Set numerous functionalities by Using Cors" */
    const cors = require('cors');
    const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
    }
    app.use(cors(corsOptions));
/* end */


/* start : 'Connect With MongoDB Database' */
    const connectMongoDB = require(fconf('CORE:config') + '/database');
    connectMongoDB.db;
/* end */

/*  start : "Set Static Assets for resources" */
    app.use(express.static('public/assets'));
    app.use('/storage', express.static('storage'));
/* end */


/* start : "Set For Flash Alerts and Messages and Sessions" */
    const session = require('express-session');
    
    app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
    }));

    const flash = require('connect-flash');
    app.use(flash());
/* end */

/* start: "Csrf Token Verifier" */
    var csrf = require('csurf');
    app.use(cookieParser(process.env.CSRF_SECRET));  //cookieparser must be placed before csrf 
    const csrfProtection = csrf({ cookie: true });  //or we can use  {key:'XSRF-TOKEN',path:'/'} or {cookie:true}
/* end */

/*  start : "Used Middleware, services and Helpers" */

    // Middleware
    const { byPassCsrfForApis } = require(fconf('CORE:http:middleware') + '/ValidateFirstParamMiddleware');

/*  end */


/* start : "Apply CSRF protection to all routes except API routes" */

    // CSRF Check for Post Routes Request
    app.use((req, res, next) => {
    if (byPassCsrfForApis(req, res, next)) {
        return next();
    }
    csrfProtection(req, res, next);
    });

    // Pass CSRF Token Value In View Files
    app.use((req, res, next) => {
    if (byPassCsrfForApis(req, res, next)) {
        return next();
    }
    res.locals.csrfToken = req.csrfToken();
    next();
    });
/* end */

/* start :  "Set Globally Middleware For View To Get Base Url" */
    app.use((req, res, next) => {
    res.locals.base_url = path_render;
    next();
    });
/* end */

/* start :  "Set Globally Middleware For View To Check User Permision" */
app.use((req, res, next) => {
    res.locals.gatePermision = (permisions, requiredPermissions, checker = "every") => {

        const hasRequiredPermissions = requiredPermissions[checker](permission => permisions.includes(permission));

        return hasRequiredPermissions;
    };
    next();
});
/* end */

/* start : "Server Listen Port" */
    app.listen(PORT);
/* end */

return app;
}