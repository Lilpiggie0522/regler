"use client"
import React, { useEffect, useState } from "react";
import { FaTrash, FaUndo, FaPlus } from "react-icons/fa";
import { AssessmentModalProps } from "./ModalProps";
import ErrorModal from "./errorModal";

const AssessmentModal: React.FC<AssessmentModalProps> = ({ onClose, courseId }) => {
    const [Assessments, setAssessments] = useState<string[]>([]);
    const [newAssessment, setNewAssessment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [AssessmentsToDelete, setAssessmentsToDelete] = useState<string[]>([]);

    // fetch all already exist stages
    useEffect(() => {

        const fetchAssessment = async (courseId: string|null) => {
            try {

                // should return a list of teams in this course
                const res = await fetch(`/api/adminSystem/courses/setCourseAssignment/${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (!res.ok) {
                    console.log()
                    const errObj = await res.json();
        
                    throw Error(errObj.error);
                }
    
                const data = await res.json();
                const assignments = data.assignments.map((assignment: { assignmentName: string }) => assignment.assignmentName);
                setAssessments(assignments);
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to fetch Assessments. Please try again.");
                setShowErrorModal(true);
            }
        }
        
        fetchAssessment(courseId);
    }, [courseId]);

    const handleSubmit = async () => {
        const updatedAssessments = Assessments.filter(Assessment => !AssessmentsToDelete.includes(Assessment)); // Remove deleted Assessments

        // Add new Assessment if it exists
        if (newAssessment.trim()) {
            updatedAssessments.push(newAssessment.trim());
        }

        // Prepare the request body with the updated list of Assessments
        const body = {
            assignments: updatedAssessments.map(assessment => ({
                assignmentName: assessment, 
            })),
        };

        console.log("Submitting the following data:", body);

        try {
            const response = await fetch(`/api/adminSystem/courses/setCourseAssignment/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errObj = await response.json();
                console.error("Error Response:", errObj);
                throw Error(errObj.error);
            }

            setAssessments(updatedAssessments); // Update current Assessments
            setNewAssessment("");
            setAssessmentsToDelete([]);

            setErrorMessage("Assessments have been successfully update.");
            setShowErrorModal(true);
            // onClose();
            // alert(updatedAssessments)
            
        } catch (error) {
            setErrorMessage("Failed to update Assessments. Please try again.");
            console.error("Submission Error:", error);
            setShowErrorModal(true);
        }
    };

    const handleAddAssessment = () => {
        if (newAssessment.trim()) {
            setAssessments(prev => [...prev, newAssessment.trim()]); // Add new Assessment to the list
            setNewAssessment(""); // Clear input after adding
        }
    };

    const handleDelete = (Assessment: string) => {
        if (!AssessmentsToDelete.includes(Assessment)) {
            setAssessmentsToDelete(prev => [...prev, Assessment]);
        }
    };

    const handleUndoDelete = (Assessment: string) => {
        // Remove Assessment from deletion list and restore it to the Assessments
        setAssessmentsToDelete(prev => prev.filter(p => p !== Assessment));

        setAssessments(prev => {
            if (!prev.includes(Assessment)) {
                return [...prev, Assessment];
            }
            return prev;
        });
    };

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
                
                <h2 className="text-md font-bold text-black">Current Assessments</h2>
                
                <div className="flex flex-col mt-4">
                    {Assessments.length > 0 ? (
                        Assessments.map((Assessment) => (
                            <div key={Assessment} className={`flex items-center justify-between mb-1 ${AssessmentsToDelete.includes(Assessment) ? "opacity-50 line-through text-black" : ""}`}>
                                <div className="bg-yellow-400 text-black rounded-full px-4 py-1">
                                    {Assessment}
                                </div>
                                <div className="flex items-center">
                                    <button className="text-black p-1" onClick={() => handleDelete(Assessment)}>
                                        <FaTrash />
                                    </button>

                                    {AssessmentsToDelete.includes(Assessment) && (
                                        <button className="text-black p-1" onClick={() => handleUndoDelete(Assessment)}>
                                            <FaUndo />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 text-center">No Assessments available.</span>
                    )}
                </div>

                <h2 className="text-md mt-4 text-black font-bold">Enter new Assessment</h2>
                <div className="flex items-center mt-2">
                    <input
                        value={newAssessment}
                        onChange={(e) => setNewAssessment(e.target.value)}
                        className="border border-gray-400 rounded-lg w-full p-1 text-gray-800"
                        type="text"
                        placeholder="Example: Assignment 1"
                    />
                    <button 
                        onClick={handleAddAssessment}
                        className="bg-yellow-500 text-white rounded-lg ml-2 px-2 py-2"
                    >
                        <FaPlus />
                    </button>
                </div>
                
                <button 
                    onClick={handleSubmit} 
                    className="bg-black text-white py-2 rounded-lg w-full mt-4"
                >
                    Submit
                </button>

                {/* ErrorModal */}
                {showErrorModal && (
                    <ErrorModal
                        errorMessage={errorMessage}
                        onClose={() => setShowErrorModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default AssessmentModal;
