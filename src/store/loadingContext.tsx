import React, { createContext, useContext, useState } from "react";

// Create a new context
const LoadingContext = createContext<
  | {
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

// Create a provider component
export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for using the context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
