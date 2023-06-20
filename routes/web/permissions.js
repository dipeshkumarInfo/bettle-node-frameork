const router=require('express').Router();
const multer = require("multer");
const { authPermissionsMiddleware } = require(fconf('CORE:http:middleware')+ "/AuthenticateRolesMiddleware");
const prm = require(fconf('CORE:app:enum')+ "/PermisionsEnum");

const {
    View,
    Add,
    Store,
    Edit,
    Update,
    Delete
} = require(fconf('CORE:http:controllers')+ '/PermissionsController');

const upload = multer();

router.get('/', authPermissionsMiddleware([prm.PERMISSIONS_VIEW]), View);
router.get('/add', authPermissionsMiddleware([prm.ROLES_CREATE]), Add);
router.get('/:id/edit', authPermissionsMiddleware([prm.PERMISSIONS_UPDATE]), Edit);


router.post('/add', upload.none(), authPermissionsMiddleware([prm.ROLES_CREATE], "json"), Store);
module.exports = router;

router.post('/:id/update', upload.none(), authPermissionsMiddleware([prm.PERMISSIONS_UPDATE], "json"), Update);

router.post('/:id/delete', upload.none(), authPermissionsMiddleware([prm.PERMISSIONS_DELETE], "json"), Delete);


module.exports = router;