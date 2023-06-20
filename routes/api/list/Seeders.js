module.exports = (router) => {

    router.post('/seeder/:filename',(req, res, next) => {
        try{
              let seeders = require(fconf('CORE:database:seeders') + `/${req.params.filename}`);
              seeders(req, res, next);
        }catch(err){
              return res.send({ msg: err.message, status: false });
        }
    });

  return router;
}