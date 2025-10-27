import React, { createContext, useContext } from 'react';

interface TabContextType {
  tabKey: string;
}

const TabContext = createContext<TabContextType | null>(null);

export const TabProvider: React.FC<{ tabKey: string; children: React.ReactNode }> = ({ 
  tabKey, 
  children 
}) => {
  return (
    <TabContext.Provider value={{ tabKey }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  return context; // null일 수 있음 (전역에서 사용하는 경우)
};

