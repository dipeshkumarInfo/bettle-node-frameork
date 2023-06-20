const userFactory = require(fconf('CORE:database:factory')+ "/UserFactory");
const Role = require(fconf('CORE:app:models')+ "/UserRolesModel");
const RolesEnum = require(fconf('CORE:app:enum')+ "/RolesEnum");

const insertData = async (req,resp) => {

    const roleId = await Role.findOne({ 'status': 1, "name": RolesEnum.SUPREME_ADMIN_ROLE_NAME });

    if(roleId == null || roleId.length == 0)
    {
        return resp.status(400).json({ result: "Invalid Role",dataResponse: "N/A", status: false });
    }

    try{
        const userData = await userFactory(req, roleId._id, 1);

        if(userData.status)
        {
            return resp.status(200).json({ result: "Users Data Seeding Done with supreme admin role", status: true, dataResponse: userData.result });
        }
        return resp.status(400).json({ result: "Users Data Seeding Not Done Yet : " + userData.result, dataResponse: "N/A", status: false });
    }
    catch(err){
        return resp.status(500).json({ result: err.message, dataResponse: "N/A", status: false });
    }
}

module.exports = insertData ;