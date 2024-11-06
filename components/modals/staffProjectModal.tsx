"use client"
import React, { useEffect, useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ModalProps } from './ModalProps';

const ProjectModal: React.FC<ModalProps> = ({ onClose }) => {
    const [projects, setProjects] = useState<string[]>([]);
    const [newProject, setNewProject] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const modalRef = useRef<HTMLDivElement | null>(null);

    // fetch all already exist stages
    useEffect(() => {
        const fetchStages = async () => {
            const dummyData = ['Stage 1', 'Stage 2', 'Stage 3'];
            setProjects(dummyData);
            // try {
            //     const response = await fetch('/api/assignments');
            //     if (!response.ok) throw new Error('Failed to fetch assignments');

            //     // const data = await response.json();
            //     // setStages(data);
            // } catch (error) {
            //     console.error(error);
                // setErrorMessage('Failed to delete stage. Please try again.');
            // }
        };
        
        fetchStages();
    }, []);

    


    const handleSubmit = async () => {
        if (newProject.trim()) {
            try {
                const response = await fetch('/api/assignments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ project: newProject }),
                });

                if (!response.ok) throw new Error('Failed to add assignment');
                const addedProject = await response.json();
                setProjects((prev) => [...prev, addedProject.project]);
                setNewProject('');
            } catch (error) {
                setErrorMessage('Failed to add stage. Please try again.');
                console.error(error);
            }
        }
    };

    const handleDelete = async (project: string) => {
        try {
            const response = await fetch(`/api/assignments/${project}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete assignment');
            setProjects((prev) => prev.filter(a => a !== project));
        } catch (error) {
            setErrorMessage('Failed to delete stage. Please try again.');
            console.error(error);
        }
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
                
                <h2 className="text-lg font-bold text-black">Current Stage</h2>
                
                <div className="flex flex-col mt-4">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project} className="flex items-center justify-between mb-1">
                                <div className="bg-yellow-400 text-black rounded-full px-4 py-1">
                                    {project}
                                </div>
                                <button className="text-black  p-1" onClick={() => handleDelete(project)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 text-center">No stages available.</span>
                    )}
                </div>

                <h2 className="text-lg mt-4 text-black font-bold">Input New Stage</h2>
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
