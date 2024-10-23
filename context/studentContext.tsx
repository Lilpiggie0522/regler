'use client'
import React, { createContext, useState, useContext, ContextType } from 'react';

interface contextType {
  useLocalStorageState: <T>(key: string, value: T) => [T, React.Dispatch<React.SetStateAction<T>>];
}

interface StudentProviderProps {
  children: React.ReactNode;  // ReactNode represents any valid JSX element, string, etc.
}

// Create the context with a default value of null
const StudentContext = createContext<contextType | null>(null);

// Custom hook to use the context
export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}

// Provider component
export function StudentProvider({ children }: StudentProviderProps) {
  useLocalStorageState('studentId', '')
  return (
    // studentId, teamId, courseId, 
    <StudentContext.Provider value={{ useLocalStorageState }}>
      {children}
    </StudentContext.Provider>
  );
}


export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setStateRaw] = useState<T>(getStorageItem(key, defaultValue))
  const setState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    saveStorageItem(key, value as string)
    setStateRaw(value)
  }
  
  return [state, setState]
}

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key)
    if (value) {
      return value as T;
    }
  }
  return defaultValue;
}

function saveStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}