module.exports = (router) => {
    const { permissionsList, updatePermissionById, permisionsByUserId } = require(fconf('CORE:controllers:api')+ '/PermissionsController');

    router.post('/permissions/update/:permissionid', async (req, res) => {
        const { name, label } = req.body;
        const result = await updatePermissionById(req.params.permissionid, {name, label});
        return res.send(result);
    });

    router.post('/permissions/:permissionid?', permissionsList);

    router.post('/user/permissions/:userId', async (req, resp) => {
        const { userId } = req.params;
        const result = await permisionsByUserId(userId);
        return resp.send(result);
    });

    return router;
}