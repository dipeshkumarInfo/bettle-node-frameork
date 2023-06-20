module.exports = (router) => {
    const { rolesList, updatePermissionByRoleId, userRolesByRolesId, updateRolesByUerId, AttachAllPermissionToRoleById } = require(fconf('CORE:controllers:api')+ '/RolesController');

    router.post('/roles/permissions/:roleid', async (req, res) => {
        const { permissionByComma } = req.body;
        const permissions = permissionByComma.split(",").map(str => str.replace(/\s/g, ""));

        console.log("Permisions List : ");
        console.log(permissions);

        const result = await updatePermissionByRoleId(req.params.roleid, permissions);
        return res.send(result);
    });

    router.post('/roles/attach-all-permissions/:roleid', async (req, res) => {
        const result = await AttachAllPermissionToRoleById(req.params.roleid);
        return res.send(result);
    });

    router.post('/roles/:roleid?', rolesList);

    router.post('/roles/user/by-rolesid', userRolesByRolesId);

    router.post('/roles/user/update-roles', updateRolesByUerId);


    return router;
}