import { useState, useCallback } from 'react';
import { PAGES } from '../utils/constants';

export const useAppState = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.LOADING);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const changePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const resetState = useCallback(() => {
    setIsConnected(false);
    setLoading(true);
    setError(null);
    setCurrentPage(PAGES.LOADING);
  }, []);

  return {
    currentPage,
    isConnected,
    loading,
    error,
    changePage,
    setIsConnected,
    setLoading,
    setError,
    resetState
  };
};
