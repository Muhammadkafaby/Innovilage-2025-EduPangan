'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * @param {string} baseUrl - Base API URL
 */
export function useApi(baseUrl = '/api') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function for API calls
  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // GET request
  const get = useCallback(async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiCall(url, { method: 'GET' });
  }, [apiCall]);

  // POST request
  const post = useCallback(async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [apiCall]);

  // PUT request
  const put = useCallback(async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [apiCall]);

  // DELETE request
  const del = useCallback(async (endpoint) => {
    return apiCall(endpoint, { method: 'DELETE' });
  }, [apiCall]);

  return { get, post, put, delete: del, loading, error };
}

export default useApi;
