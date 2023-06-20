module.exports = function(nconf, dirname) {

    global.nconf = nconf.argv().env().file({ file: 'config.json' });
    // nconf.argv().env().file({ file: 'config.json' });
    

    //Set Base Url From .env Or Config.json
    global.base_path = nconf.any('CBASE_URL', 'BASE_URL'); //process.env.BASE_URL;


    /*  Set Global Middleware nconf */
    global.fconf = (core_path,level = "/") => {
        return dirname + level + nconf.get(core_path);
    };

    global.api_url = ['api'] ;

    global.proceedTo = (req) => {
        let paramStatus = false;
        if (api_url.includes(req.params.path)) {
            paramStatus = true;
        }
        return paramStatus;
    }
};


