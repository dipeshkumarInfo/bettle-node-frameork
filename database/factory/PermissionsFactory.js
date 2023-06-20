const Permissions = require(fconf('CORE:app:models')+ "/PermissionsModel");

let process = false;
let msg = "";

const Factory = async (difFaker = {}, counter) => {

    return Permissions.deleteMany({})
    .then(() => {
        const updatePermissions = async () => {
                try {
                    const allPermisions  = difFaker.permissions;

                    var i =0;
                    for(i=0; i < counter; i++)
                    {
                        const permissions = await Permissions.findOneAndUpdate(
                            { name: allPermisions[i]  }, // query for the document you want to update or create
                            { name: allPermisions[i], label: allPermisions[i], description:allPermisions[i] }, // update or create the document with this data
                            { upsert: true, new: true, setDefaultsOnInsert: true } // options object
                          );
                
                        if(permissions)
                        {
                            process = true;
                            console.log('Data saved successfully : ' + allPermisions[i]);
                        }else{
                            msg = permissions;
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
                    console.log(msg);
                    return { result: msg, status: process };

                }catch (error) {
                    console.error('Error updating permissions:', error.message);
                    return { result: error.message, status: false };
                }
        };
        
        return updatePermissions();
    })
    .catch((error) => {
        console.error('Error emptying collection:', error.message);
        return { result: "All Permission Not Reseted", status: false };
    });
}

module.exports =  Factory;