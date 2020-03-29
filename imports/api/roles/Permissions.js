export const Permissions = {}

// ROLES
Permissions.roles = {}
Permissions.roles.add = 'addRoles'
Permissions.roles.edit = 'editRoles'
Permissions.roles.delete = 'deleteRoles'

// USERS
Permissions.users = {}
Permissions.users.add = 'addUsers'
Permissions.users.edit = 'editUsers'
Permissions.users.delete = 'deleteUsers'
Permissions.users.invite = 'inviteUsers'

// BACKEND
Permissions.backend = {}
Permissions.backend.access = 'accessBackend'
Permissions.backend.apps = 'editApps'
Permissions.backend.sets = 'manageSets'
Permissions.backend.units = 'manageUnits'
Permissions.backend.competencies = 'manageCompetencies'
Permissions.backend.scoring = 'manageScoring'
Permissions.backend.evaluation = 'manageEvaluation'

// COURSES / CLASSES
Permissions.classes = {}
Permissions.classes.manage = 'manageClasses'
Permissions.classes.repsonses = 'readOthersResponses'
Permissions.classes.evaluation = 'readOthersEvaluations'
