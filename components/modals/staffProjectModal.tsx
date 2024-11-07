"use client"
import React, { useEffect, useState, useRef } from 'react';
import { FaTrash, FaUndo } from 'react-icons/fa';
import { ProjectModalProps } from './ModalProps';

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, courseId }) => {
    const [projects, setProjects] = useState<string[]>([]);
    const [newProject, setNewProject] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [projectsToDelete, setProjectsToDelete] = useState<string[]>([]);

    // fetch all already exist stages
    useEffect(() => {
        const fetchProject = async () => {
            const dummyData = ['Stage 1', 'Stage 2', 'Stage 3'];
            setProjects(dummyData);
            try {
                // get method
                const response = await fetch(`/api/adminSystem/setCourseAssignment/${courseId}`);
                if (!response.ok) throw new Error('Failed to fetch projects');

                const data = await response.json();
                const assignmentNames = data.assignments.map((assignment: { assignmentName: string }) => assignment.assignmentName);
                setProjects(assignmentNames);
                // assignments : [{assignmentName}]
            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to fetch projects. Please try again.');
            }
        };
        
        fetchProject();
    }, [courseId]);

    const handleSubmit = async () => {
        const updatedProjects = projects.filter(project => !projectsToDelete.includes(project)); // Remove deleted projects

        // Add new project if it exists
        if (newProject.trim()) {
            updatedProjects.push(newProject.trim());
        }

        // Prepare the request body with the updated list of projects
        const body = {
            assignments: updatedProjects,
        };

        try {
            const response = await fetch(`/api/adminSystem/setCourseAssignment/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to update assignments');
            setProjects(updatedProjects); // Update current projects
            setNewProject(''); // Clear input
            setProjectsToDelete([]); // Clear delete list
        } catch (error) {
            setErrorMessage('Failed to update projects. Please try again.');
            console.error(error);
        }
    };

    const handleDelete = (project: string) => {
        if (!projectsToDelete.includes(project)) {
            setProjectsToDelete(prev => [...prev, project]);
        }
    };

    const handleUndoDelete = (project: string) => {
        // Remove project from deletion list and restore it to the projects
        setProjectsToDelete(prev => prev.filter(p => p !== project));
        // Only add it back if it's not already in the projects list
        setProjects(prev => {
            if (!prev.includes(project)) {
                return [...prev, project];
            }
            return prev;
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setErrorMessage('');
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                
                <button
                    className="absolute top-2 right-2 text-black text-3xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                    <h1 className="text-lg text-black font-semibold text-center">
                        Please click 'Submit' to save your changes after editing.
                    </h1>
                </div>
                
                <h2 className="text-md font-bold text-black">Current Stage</h2>
                
                <div className="flex flex-col mt-4">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project} className={`flex items-center justify-between mb-1 ${projectsToDelete.includes(project) ? 'opacity-50 line-through text-black' : ''}`}>
                                <div className="bg-yellow-400 text-black rounded-full px-4 py-1">
                                    {project}
                                </div>
                                <div className="flex items-center">
                                    <button className="text-black p-1" onClick={() => handleDelete(project)}>
                                        <FaTrash />
                                    </button>

                                    {projectsToDelete.includes(project) && (
                                        <button className="text-black p-1" onClick={() => handleUndoDelete(project)}>
                                            <FaUndo /> {/* Use FaUndo icon */}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 text-center">No stages available.</span>
                    )}
                </div>

                <h2 className="text-md mt-4 text-black font-bold">Input New Stage</h2>
                <input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="border border-gray-400 rounded-lg w-full mt-2 p-2 text-gray-800"
                    type="text"
                />
                
                <button 
                    onClick={handleSubmit} 
                    className="bg-black text-white py-2 rounded-lg w-full mt-4"
                >
                    Submit
                </button>

                {errorMessage && (
                    <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
                )}
            </div>
        </div>
    );
};

export default ProjectModal;
