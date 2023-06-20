const faker = require('faker');
const { CreateAccount } = require(fconf('CORE:controllers:api')+ '/AccountWithCommonDetailCreateController');
const UsersResponse = require(fconf('CORE:http:responses')+ '/Users');

let process = false;
let msg = "";
let token = "";

const Factory = async (req,  user_roles_id , counter) => {
    var i =0;
    for(i=0; i < counter; i++)
    {
        req.body.email  = await ((i == 0 ) ? req.body.email : faker.internet.email());

        const response = await CreateAccount(req, user_roles_id);
        const userId = response.userId;

        if(userId && typeof userId != "undefined")
        {
            const userDtl = await UsersResponse.userFindById(userId);

            token += "[ User Id: "+userId + " and Token : "+ userDtl._token + " ]";
        }

        if((response && response.status))
        {
            process = true;
            console.log('Data saved successfully');
        }
        else{
            msg =  response.msg;
            console.error('Error saving data:', msg);
        }

        if(process == false)
        {
            break;
        }
    }

    if(i == counter)
    {
        return { result: "Data saved successfully"+ " , User Tokens: "+ token, status: process };
    }
    return { result: msg, status: process };
}

module.exports =  Factory;