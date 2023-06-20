const router=require('express').Router();
const multer = require("multer");
const { authPermissionsMiddleware } = require(fconf('CORE:http:middleware')+ "/AuthenticateRolesMiddleware");
const prm = require(fconf('CORE:app:enum')+ "/PermisionsEnum");

const {
    View,
    Add,
    Delete,
    LoggedUserDetail
} = require(fconf('CORE:http:controllers')+ '/UsersController');

const upload = multer();

router.get('/', authPermissionsMiddleware([prm.USERS_VIEW]), View);
router.get('/add', authPermissionsMiddleware([prm.USERS_CREATE]), Add);

router.post('/:id/delete', upload.none(), authPermissionsMiddleware([prm.USERS_DELETE], "json"), Delete);

router.post('/logged-user-detail', upload.none(), LoggedUserDetail);

module.exports = router;