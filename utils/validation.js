const VALID_ROLES = ["admin", "manager", "worker"];
const VALID_PROJECT_STATUSES = ["planned", "active", "completed"];

export const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export const isPositiveInteger = (value) =>
  Number.isInteger(value) && value >= 0;

export const isValidDateString = (value) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

export const validateRegisterPayload = ({ name, email, password, role }) => {
  const errors = [];

  if (!isNonEmptyString(name)) errors.push("name is required");
  if (!isValidEmail(email)) errors.push("valid email is required");
  if (typeof password !== "string" || password.length < 6) {
    errors.push("password must be at least 6 characters");
  }
  if (!VALID_ROLES.includes(role)) {
    errors.push("role must be one of: admin, manager, worker");
  }

  return errors;
};

export const validateLoginPayload = ({ email, password }) => {
  const errors = [];

  if (!isValidEmail(email)) errors.push("valid email is required");
  if (!isNonEmptyString(password)) errors.push("password is required");

  return errors;
};

export const validateProjectPayload = ({
  name,
  description,
  start_date,
  end_date,
  status,
}) => {
  const errors = [];

  if (!isNonEmptyString(name)) errors.push("name is required");
  if (!isNonEmptyString(description)) errors.push("description is required");
  if (!isValidDateString(start_date)) errors.push("valid start_date is required");
  if (!isValidDateString(end_date)) errors.push("valid end_date is required");
  if (!VALID_PROJECT_STATUSES.includes(status)) {
    errors.push("status must be one of: planned, active, completed");
  }

  if (
    isValidDateString(start_date) &&
    isValidDateString(end_date) &&
    new Date(start_date) > new Date(end_date)
  ) {
    errors.push("start_date cannot be after end_date");
  }

  return errors;
};

export const validateProjectUpdatePayload = (payload) => {
  const errors = [];
  const allowedFields = [
    "name",
    "description",
    "start_date",
    "end_date",
    "status",
  ];
  const providedFields = Object.keys(payload);

  if (providedFields.length === 0) {
    errors.push("at least one field is required for update");
    return errors;
  }

  for (const field of providedFields) {
    if (!allowedFields.includes(field)) {
      errors.push(`unsupported field: ${field}`);
    }
  }

  if ("name" in payload && !isNonEmptyString(payload.name)) {
    errors.push("name must be a non-empty string");
  }
  if ("description" in payload && !isNonEmptyString(payload.description)) {
    errors.push("description must be a non-empty string");
  }
  if ("start_date" in payload && !isValidDateString(payload.start_date)) {
    errors.push("start_date must be a valid date");
  }
  if ("end_date" in payload && !isValidDateString(payload.end_date)) {
    errors.push("end_date must be a valid date");
  }
  if ("status" in payload && !VALID_PROJECT_STATUSES.includes(payload.status)) {
    errors.push("status must be one of: planned, active, completed");
  }

  return errors;
};

export const validateDprPayload = ({
  date,
  work_description,
  weather,
  worker_count,
}) => {
  const errors = [];

  if (!isValidDateString(date)) errors.push("valid date is required");
  if (!isNonEmptyString(work_description)) {
    errors.push("work_description is required");
  }
  if (!isNonEmptyString(weather)) errors.push("weather is required");

  const parsedWorkerCount = Number(worker_count);
  if (!Number.isInteger(parsedWorkerCount) || parsedWorkerCount < 0) {
    errors.push("worker_count must be a non-negative integer");
  }

  return errors;
};
