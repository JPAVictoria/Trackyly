import { createContext, useState, useContext, ReactNode } from 'react';
import { CircularProgress } from '@mui/material'; 

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-[#FBFBFE] flex justify-center items-center">
          <CircularProgress size={60} sx={{ color: '#2F27CE' }}/>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
