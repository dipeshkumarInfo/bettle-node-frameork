const router=require('express').Router();

const {
    FourHundredThree,
    FourHundredFour,
    FiveHundred
} = require(fconf('CORE:http:controllers')+ '/ErrorsHandleController');

router.get('/:errorLabel(access-forbidden|access-denied)?/403',FourHundredThree);
router.get('/:errorLabel(page-not-found|request-encountered)?/404',FourHundredFour);
router.get('/:errorLabel(request-encountered|request-error)?/500',FiveHundred);

module.exports = router;