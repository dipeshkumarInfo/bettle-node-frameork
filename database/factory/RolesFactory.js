const Permissions = require(fconf('CORE:app:models') + '/PermissionsModel');
const Role = require(fconf('CORE:app:models')+ "/UserRolesModel");
const RolesEnum = require(fconf('CORE:app:enum')+ "/RolesEnum");

let process = false;
let msg = "";

const Factory = async (difFaker = {}, counter) => {
    
    const rolesName = [RolesEnum.SUPREME_ADMIN_ROLE_NAME, RolesEnum.SUPERADMIN_ROLE_NAME, RolesEnum.ADMIN, RolesEnum.USERS];

    const permissionsArr = [[], [], [], []];

    var i =0;
    for(i=0; i < counter; i++)
    {
        const roles = await Role.findOneAndUpdate(
            { name: rolesName[i]  }, // query for the document you want to update or create
            { name: rolesName[i], label: rolesName[i], permissions: permissionsArr[i].slice(i) }, // update or create the document with this data
            { upsert: true, new: true, setDefaultsOnInsert: true } // options object
          );

        if(await roles.save())
        {
            process = true;
            console.log('Data saved successfully');
        }else{
            msg = roles;
            console.error('Error saving data:', msg);
        }

        if(process == false)
        {
            break;
        }
    }

    if(i == counter)
    {
        return { result: "Data saved successfully", status: process };
    }
    return { result: msg, status: process };
}

module.exports =  Factory;