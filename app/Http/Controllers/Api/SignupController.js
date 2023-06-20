const router = require("express").Router();

const signup = async (req, res) => {

    try {
        // Get user input
        const { name, mobile_number, email, password, pin, user_roles_id } = req.body;
    
        // Validate user input
        if (!(email && password && name)) {
          return res.status(422).json({ msg: 'email , password, name , Pin and Type  input is required' });
        }

        // ******* incomplete
        
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
};

router.post("/", signup);

module.exports = router;
