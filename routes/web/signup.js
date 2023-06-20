const router = require("express").Router();

const { 
  View,
  Edit,
  Update,
  Create
} = require(fconf('CORE:http:controllers')+ "/SignUpController");


router.get("/", View);
router.post("/", Create);

router.get('/:id/edit', Edit);
router.post('/:id/update', Update);

module.exports = router;
