const router = require("express").Router();

/* Seeders */
list = require(fconf('CORE:api:list')+ '/Seeders')(router);


module.exports = list;