/**
 * API client for making requests to the backend server
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Test database connection
 */
export const testDatabaseConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test-db`);
    return await response.json();
  } catch (error) {
    console.error("Error testing database connection:", error);
    throw error;
  }
};
