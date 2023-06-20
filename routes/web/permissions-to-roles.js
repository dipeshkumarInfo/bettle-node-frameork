const router=require('express').Router();
const multer = require("multer");
const { authPermissionsMiddleware } = require(fconf('CORE:http:middleware')+ "/AuthenticateRolesMiddleware");
const prm = require(fconf('CORE:app:enum')+ "/PermisionsEnum");

const {
    View,
    Add,
    Store,
    Edit
} = require(fconf('CORE:http:controllers')+ '/PermissionsToRolesController');

const upload = multer();

/**************************  Permissions To Roles **************************/
router.get('/', authPermissionsMiddleware([prm.PERMISSIONS_TO_ROLES_VIEW]), View);
router.get('/add', authPermissionsMiddleware([prm.PERMISSIONS_TO_ROLES_ASSIGN]), Add);
router.get('/:id/edit', authPermissionsMiddleware([prm.PERMISSIONS_TO_ROLES_ASSIGN]), Edit);


router.post('/add', upload.none(), authPermissionsMiddleware([prm.PERMISSIONS_TO_ROLES_ASSIGN], "json"), Store);

/**************************  Permissions To Roles **************************/

module.exports = router;