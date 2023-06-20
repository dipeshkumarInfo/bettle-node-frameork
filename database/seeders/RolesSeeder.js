const rolesFactory = require(fconf('CORE:database:factory')+ "/RolesFactory");

const insertData = async (req,resp) => {
try{
    const rolesData = await rolesFactory({}, 4);
    if(rolesData.status)
    {
        return resp.status(200).json({ result: "Roles Data Seeding Done", status: true });
    }
    return resp.status(400).json({ result: "Roles Data Seeding Not Done Yet : "+ rolesData.result, status: false });

}catch(err)
{
    return resp.status(500).json({ result: err.message, status: false });
}
}

module.exports = insertData ;