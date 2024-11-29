"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
/**
 * An enum that defines the subjects that events can be published to.
 */
var Subjects;
(function (Subjects) {
    Subjects["PersonnelCreated"] = "Personnel:created";
    Subjects["PersonnelUpdated"] = "Personnel:updated";
    Subjects["RoleCreated"] = "Role:created";
    Subjects["RoleUpdated"] = "Role:updated";
    Subjects["RoleDeleted"] = "Role:deleted";
})(Subjects || (exports.Subjects = Subjects = {}));
