const creator = process.env.CREATOR_PERMISSION_LABEL;

const PermisionsEnum = {
    /* Roles */
    ROLES_VIEW : "roles.view",
    ROLES_UPDATE : "roles.update",
    ROLES_CREATE : "roles.create",
    ROLES_DELETE : "roles.delete",

    /* Permissions */
    PERMISSIONS_VIEW : "permissions.view",
    PERMISSIONS_CREATE : "permissions.create",
    PERMISSIONS_UPDATE : "permissions.update",
    PERMISSIONS_DELETE : "permissions.delete",

    /* Assing Roles and Permissions */
    PERMISSIONS_TO_ROLES_VIEW : "permissions.to.roles.view",
    PERMISSIONS_TO_ROLES_ASSIGN : "permissions.to.roles.assign",

    ROLES_TO_USERS_VIEW : "roles.to.users.view",
    ROLES_TO_USERS_ASSIGN : "roles.to.users.assign",

    /* Notification Permissions */
    NOTIFICATIONS_INDEX : "notifications.index",
    NOTIFICATIONS_SEND : "notifications.create",
    NOTIFICATIONS_RECEIVED : "notifications.received",
    
    USERS_VIEW : "users.view",
    USERS_CREATE : "users.create",
    USERS_DELETE : "users.delete",
    USERS_UPDATE : "users.update",


    SELF_PROFILE_DETAIL_UPDATE : "self.profile.detail.update",

    CHANGE_ACCOUNT_PASSWORD : "change.account.password"
}

module.exports =  PermisionsEnum;