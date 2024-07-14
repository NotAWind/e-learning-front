"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the type for the user session data
interface UserSession {
  userId: string;
  email: string;
  userName: string;
  role: string;
  avatar: string;
}

// Define the context type
interface SessionContextType {
  session: UserSession | null;
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>;
}

// Create the context with a default value
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Define the provider's props type
interface SessionProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<UserSession | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Create a custom hook to use the session context
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
