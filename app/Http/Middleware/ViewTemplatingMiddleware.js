const myLogger = function (values, options = {}) {

    const PrEnum = require(fconf('CORE:app:enum')+ "/PermisionsEnum");
    const userPermisions = { permisions: options.upermisions || [] };

    return {sidenav:true, header:true, ...values, ...options, ...PrEnum, ...userPermisions};
}

module.exports=myLogger;