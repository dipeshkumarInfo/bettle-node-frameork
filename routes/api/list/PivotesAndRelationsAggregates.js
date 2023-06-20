module.exports = (router) => {

    const { userRolesAndPermisionsResult } = require(fconf('CORE:controllers:api')+ '/UserPermisionsListController');
    

    router.post('/user_roles_permissions/:userid?', userRolesAndPermisionsResult);

    return router;

}