const router=require('express').Router();

const {
    View
} = require(fconf('CORE:http:controllers')+ '/ProfileController');

router.get('/',View);

module.exports = router;