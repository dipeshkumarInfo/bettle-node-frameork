module.exports = (router) => {

    const { userDetailsById, userDetailById } = require(fconf('CORE:controllers:api')+ '/GetUserProfileDetailController');
    const { permissionsCheckByUserId } = require(fconf('CORE:controllers:api')+ '/PermissionsController');
    const { rolesAndPermissionChecks } = require(fconf('CORE:controllers:api')+ '/RolesController');

    router.post('/users/:id?', userDetailsById);
    
    router.post('/user/:id', async (req, res) => {
        const id = req.params.id;
        const result = await userDetailById(id);
        return res.send(result);
    });

    router.post('/users/auth/permisions', async (req, res) => {

        const { permissions, userId } = req.body;

        const permissionsArr = permissions.split(",").map(str => str.replace(/\s/g, ""));;

        const result = await permissionsCheckByUserId(userId, permissionsArr);
        // const result = await rolesAndPermissionChecks(req, ['teacher','student'], ['upcomming-classes']);
        return res.send(result);
    });

    return router;

}