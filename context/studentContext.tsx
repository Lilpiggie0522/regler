'use client'
import React, { createContext, useState, useContext, ContextType } from 'react';

// // {studentId: student._id, teamId: teamId, courseId: course._id}
// interface Student {
//   studentId: string;
//   teamId: string;
//   courseId: string;
// }

interface contextType {
  // student: Student | null;
  studentId: string;
  setStudentId: (stduentId: string) => void
  teamId: string;
  setTeamId: (teamId: string) => void
  courseId: string;
  setCourseId: (course: string) => void
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
export function StudentProvider({children}: StudentProviderProps) {
  const [studentId, setStudentId] = useState<string>('');
  const [teamId, setTeamId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  return (
    <StudentContext.Provider value={{ studentId, teamId, courseId, setStudentId, setTeamId, setCourseId}}>
      {children}
    </StudentContext.Provider>
  );
}
