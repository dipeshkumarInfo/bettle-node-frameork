const router = require("express").Router();
const rateLimiter = require(fconf('CORE:http:middleware')+ '/RateLimiterMiddleware');

const { 
    View,
    Update
} = require(fconf('CORE:http:controllers')+ "/SessionOutController");

router.get("/:_token", View);
router.post("/", rateLimiter.rateLimiterByIp, Update);

module.exports = router;
