import React, { useEffect } from 'react';
import { useAppDispatch } from '../hook';
import { loadLanguage } from '../../features/settings/settingsSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load language settings when app starts
    dispatch(loadLanguage());
  }, [dispatch]);

  return <>{children}</>;
};
