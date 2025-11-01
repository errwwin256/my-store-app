// 📅 formatDate.js

/**
 * Formats a JavaScript Date or Firestore Timestamp into readable string.
 * Example: "Oct 29, 2025, 2:30 PM"
 * @param {any} dateInput
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "—";

  let date;
  try {
    date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  } catch {
    return "Invalid Date";
  }

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

/**
 * Formats date only (no time)
 * Example: "Oct 29, 2025"
 */
export const formatDateOnly = (dateInput) => {
  if (!dateInput) return "—";
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  return date.toLocaleDateString("en-PH", {
    dateStyle: "medium",
  });
};

/**
 * Returns relative date (e.g., "3 hours ago")
 */
export const timeAgo = (dateInput) => {
  if (!dateInput) return "—";
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};
