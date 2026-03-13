import DPR from "../models/DPR.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import {
  validateProjectPayload,
  validateProjectUpdatePayload,
} from "../utils/validation.js";

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date: startDateSnake,
      end_date: endDateSnake,
      startDate,
      endDate,
      status,
    } = req.body;
    const start_date = startDateSnake ?? startDate;
    const end_date = endDateSnake ?? endDate;
    const errors = validateProjectPayload({
      name,
      description,
      start_date,
      end_date,
      status,
    });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description.trim(),
      start_date,
      end_date,
      status,
      created_by: req.user.id,
    });

    res.status(201).json({
      projectId: project.id,
      message: "Project created",
    });
  } catch (error) {
    console.error("Create project error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { status, limit = "10", offset = "0" } = req.query;
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({ message: "limit must be an integer between 1 and 100" });
    }

    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative integer" });
    }

    if (status && !["planned", "active", "completed"].includes(status)) {
      return res.status(400).json({ message: "status must be one of: planned, active, completed" });
    }

    const where = {};
    if (status) {
      where.status = status;
    }

    const projects = await Project.findAll({
      where,
      limit: parsedLimit,
      offset: parsedOffset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: DPR,
          as: "dprs",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [[{ model: DPR, as: "dprs" }, "date", "DESC"]],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      ...project.toJSON(),
      tasks: [],
    });
  } catch (error) {
    console.error("Get project error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const payload = { ...req.body };
    if ("startDate" in payload && !("start_date" in payload)) {
      payload.start_date = payload.startDate;
      delete payload.startDate;
    }
    if ("endDate" in payload && !("end_date" in payload)) {
      payload.end_date = payload.endDate;
      delete payload.endDate;
    }

    const errors = validateProjectUpdatePayload(payload);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updates = {};
    for (const key of ["name", "description", "start_date", "end_date", "status"]) {
      if (key in payload) {
        updates[key] =
          typeof payload[key] === "string" ? payload[key].trim() : payload[key];
      }
    }

    if (
      ("start_date" in updates || "end_date" in updates) &&
      new Date(updates.start_date || project.start_date) >
        new Date(updates.end_date || project.end_date)
    ) {
      return res.status(400).json({ message: "start_date cannot be after end_date" });
    }

    await project.update(updates);

    res.json({ message: "Project updated", project });
  } catch (error) {
    console.error("Update project error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
