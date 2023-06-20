const router = require("express").Router();
const rateLimiter = require(fconf('CORE:http:middleware')+ '/RateLimiterMiddleware');

const { 
  View,
  Authenticate,
  Logout
} = require(fconf('CORE:http:controllers')+ "/LoginController");


router.get(["/","/login"], View);
router.post(["/",'/login'], rateLimiter.rateLimiterByIp, Authenticate);
router.get(['/logout'], Logout);


module.exports = router;