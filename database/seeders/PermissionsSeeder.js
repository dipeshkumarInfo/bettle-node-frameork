const permissionsFactory = require(fconf('CORE:database:factory')+ "/PermissionsFactory");
const PermisionsEnum = require(fconf('CORE:app:enum')+ "/PermisionsEnum");

const insertData = async (req,resp) => {
try{
    const objectValues =  Object.values(PermisionsEnum);

    const permissionsData = await permissionsFactory({permissions: objectValues}, objectValues.length);
    if(permissionsData.status)
    {
        return resp.status(200).json({ result: "Permissions Data Seeding Done", status: true });
    }
    return resp.status(400).json({ result: "Permissions Data Seeding Not Done Yet : "+ permissionsData.result, status: false });

}catch(err)
{
    return resp.status(500).json({ result: err.message, status: false });
}
}

module.exports = insertData ;