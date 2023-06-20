const router = require("express").Router();

/* Seeders */
list = require(fconf('CORE:api:list')+ '/Seeders')(router);

/* Users */
list = require(fconf('CORE:api:list')+ '/Users')(router);

/* Pivotes And Relations Aggregates */
list = require(fconf('CORE:api:list')+ '/PivotesAndRelationsAggregates')(router);

/* Roles */
list = require(fconf('CORE:api:list')+ '/Roles')(router);

/* Permissions */
list = require(fconf('CORE:api:list')+ '/Permissions')(router);


module.exports = list;