import { useState, useCallback } from "react";
import useShowToast from "./useShowToast";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const showToast = useShowToast();

  const fetchData = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      showToast("Error", error.message, "error");
      return null;
    }
  }, [showToast]);

  const get = useCallback((url) => {
    return fetchData(url);
  }, [fetchData]);

  const post = useCallback((url, body) => {
    return fetchData(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }, [fetchData]);

  const put = useCallback((url, body) => {
    return fetchData(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }, [fetchData]);

  const del = useCallback((url) => {
    return fetchData(url, {
      method: "DELETE",
    });
  }, [fetchData]);

  return { loading, error, get, post, put, del };
};

export default useFetch;