// 💰 formatCurrency.js

/**
 * Formats a number into Philippine Peso currency string.
 * Example: 1234.5 → ₱1,234.50
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "₱0.00";

  const value = Number(amount);
  if (isNaN(value)) return "₱0.00";

  return value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Parses a formatted currency string back to a number.
 * Example: "₱1,234.50" → 1234.5
 * @param {string} str
 * @returns {number}
 */
export const parseCurrency = (str) => {
  if (!str) return 0;
  return Number(str.replace(/[₱,]/g, "")) || 0;
};
