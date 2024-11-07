"use client"
import React, { useEffect, useState } from 'react';
import { FaTrash, FaUndo, FaPlus } from 'react-icons/fa';
import { ProjectModalProps } from './ModalProps';

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, courseId }) => {
    const [projects, setProjects] = useState<string[]>([]);
    const [newProject, setNewProject] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [projectsToDelete, setProjectsToDelete] = useState<string[]>([]);

    // fetch all already exist stages
    useEffect(() => {
        // const fetchProject = async () => {
        //     // const dummyData = ['Stage 1', 'Stage 2', 'Stage 3'];
        //     // setProjects(dummyData);
        //     try {
        //         // get method
        //         // const response = await fetch(`/api/adminSystem/setCourseAssignment/${courseId}`);
        //         console.log("Frontend!!!! courseID:", courseId)
        //         const response = await fetch(`/api/test/${courseId}`);
        //         if (!response.ok) throw new Error('Failed to fetch projects');

        //         const data = await response.json();
        //         const assignmentNames = data.assignments.map((assignment: { assignmentName: string }) => assignment.assignmentName);
        //         setProjects(assignmentNames);
        //         // assignments : [{assignmentName}]
        //     } catch (error) {
        //         console.error(error);
        //         setErrorMessage('Failed to fetch projects. Please try again.');
        //     }
        // };
        const fetchProjects = async (courseId: string|null) => {
            try {
                // should return a list of teams in this course
                // const response = await fetch(`/api/adminSystem/setCourseAssignment/${courseId}`);
                const res = await fetch(`/api/test/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                if (!res.ok) {
                    const errObj = await res.json();
        
                    throw Error(errObj.error);
                }
    
                const data = await res.json();
                const assignmentNames = data.assignments.map((assignment: { assignmentName: string }) => assignment.assignmentName);
                setProjects(assignmentNames);
            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to fetch projects. Please try again.');
            }
        }
        
        fetchProjects(courseId);
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

        console.log("Submitting the following data:", body);

        try {
            // const response = await fetch(`/api/adminSystem/setCourseAssignment/${courseId}`, {
            const response = await fetch(`/api/test/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to update projects');
            setProjects(updatedProjects); // Update current projects
            setNewProject(''); // Clear input
            setProjectsToDelete([]); // Clear delete list
        } catch (error) {
            setErrorMessage('Failed to update projects. Please try again.');
            console.error(error);
        }
    };

    const handleAddProject = () => {
        if (newProject.trim()) {
            setProjects(prev => [...prev, newProject.trim()]); // Add new project to the list
            setNewProject(''); // Clear input after adding
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

    // Close error message when clicking anywhere
    useEffect(() => {
        const handleClickOutside = () => {
            setErrorMessage(''); // Clear the error message on any click
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        Please click `Submit` to save all of your changes after editing.
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

                <h2 className="text-md mt-4 text-black font-bold">Enter new project</h2>
                <div className="flex items-center mt-2">
                    <input
                        value={newProject}
                        onChange={(e) => setNewProject(e.target.value)}
                        className="border border-gray-400 rounded-lg w-full p-1 text-gray-800"
                        type="text"
                        placeholder="Example: Assignment 1"
                    />
                    <button 
                        onClick={handleAddProject}
                        className="bg-yellow-500 text-white rounded-lg ml-2 px-2 py-2"
                    >
                        <FaPlus /> {/* Add icon */}
                    </button>
                </div>
                
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
