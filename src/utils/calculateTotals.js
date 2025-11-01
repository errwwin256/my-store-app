// 🧮 calculateTotals.js

/**
 * Calculates total revenue and number of sales from an array of sales.
 * @param {Array} sales - Array of sales objects with 'total' property
 * @returns {{ totalRevenue: number, totalSales: number }}
 */
export const calculateSalesTotals = (sales = []) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalSales = sales.length;
  return { totalRevenue, totalSales };
};

/**
 * Calculates total inventory value from products list.
 * @param {Array} products - Array of products with 'price' and 'stock'
 * @returns {number} totalValue - Total stock value in ₱
 */
export const calculateInventoryValue = (products = []) => {
  return products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0);
};

/**
 * Calculates total number of low-stock items.
 * @param {Array} products
 * @param {number} threshold - Stock limit for low stock
 * @returns {number}
 */
export const calculateLowStockCount = (products = [], threshold = 5) => {
  return products.filter((p) => p.stock <= threshold).length;
};
