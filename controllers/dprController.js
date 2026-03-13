import DPR from "../models/DPR.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { validateDprPayload, isValidDateString } from "../utils/validation.js";

export const createDPR = async (req, res) => {
  try {
    const { date, work_description, weather, worker_count } = req.body;
    const errors = validateDprPayload({
      date,
      work_description,
      weather,
      worker_count: Number(worker_count),
    });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const report = await DPR.create({
      project_id: Number(req.params.id),
      user_id: req.user.id,
      date,
      work_description: work_description.trim(),
      weather: weather.trim(),
      worker_count: Number(worker_count),
    });

    res.status(201).json({
      dprId: report.id,
      message: "DPR created",
    });
  } catch (error) {
    console.error("Create DPR error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProjectDPR = async (req, res) => {
  try {
    const where = { project_id: Number(req.params.id) };

    if (req.query.date) {
      if (!isValidDateString(req.query.date)) {
        return res.status(400).json({ message: "date query must be a valid date" });
      }
      where.date = req.query.date;
    }

    const reports = await DPR.findAll({
      where,
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    res.json(reports);
  } catch (error) {
    console.error("Get DPR error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
