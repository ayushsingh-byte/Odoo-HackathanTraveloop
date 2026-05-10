import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(location.pathname === '/home');

  useEffect(() => {
    if (location.pathname === '/home') setCollapsed(true);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
