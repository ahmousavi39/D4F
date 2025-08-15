import React, { useEffect } from 'react';
import { useAppDispatch } from '../hook';
import { loadLanguage } from '../../features/settings/settingsSlice';
import { loadData } from '../../features/item/itemSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load language settings and data when app starts
    dispatch(loadLanguage());
    dispatch(loadData());
  }, [dispatch]);

  return <>{children}</>;
};
