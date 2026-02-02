import axios from 'axios';
import type { ApiResponse } from '@kong-suite/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log errors in development
    if (import.meta.env.DEV) {
      if (error.response) {
        // Server responded with error
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.message);
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

// Helper function for API calls
export async function apiCall<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const response = await promise;
  if (!response.data.success) {
    throw new Error(response.data.error || 'API call failed');
  }
  return response.data.data as T;
}
