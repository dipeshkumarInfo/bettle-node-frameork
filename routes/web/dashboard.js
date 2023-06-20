const router=require('express').Router();

const {
    View
} = require(fconf('CORE:http:controllers')+ '/DashboardController');

router.get('/',View);

module.exports = router;