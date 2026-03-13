import User from "./User.js";
import Project from "./Project.js";
import DPR from "./DPR.js";

Project.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

User.hasMany(Project, {
  foreignKey: "created_by",
  as: "projects",
});

Project.hasMany(DPR, {
  foreignKey: "project_id",
  as: "dprs",
});

DPR.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

DPR.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

User.hasMany(DPR, {
  foreignKey: "user_id",
  as: "dailyReports",
});

export { User, Project, DPR };
