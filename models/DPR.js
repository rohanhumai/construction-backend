import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DPR = sequelize.define(
  "DPR",
  {
    project_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    work_description: DataTypes.TEXT,
    weather: DataTypes.STRING,
    worker_count: DataTypes.INTEGER,
  },
  {
    tableName: "daily_reports",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default DPR;
