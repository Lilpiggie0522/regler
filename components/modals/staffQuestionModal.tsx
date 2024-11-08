"use client";
import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { QuestionModalProps } from './ModalProps';

const QuestionModal: React.FC<QuestionModalProps> = ({ onClose, courseId }) => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [newQuestions, setNewQuestions] = useState<string[]>(['']); 
    const [errorMessage, setErrorMessage] = useState('');
    const [questionCount, setQuestionCount] = useState(1);

    // fetch all already exist questions
    useEffect(() => {
        // const fetchProject = async () => {
        //     // const dummyData = ['Stage 1', 'Stage 2', 'Stage 3'];
        //     // setProjects(dummyData);
        
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
                const assignments = data.assignments.map((assignment: { assignmentName: string }) => assignment.assignmentName);
                setProjects(assignments);
            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to fetch projects. Please try again.');
            }
        }
        
        fetchProjects(courseId);
    }, [courseId]);

    const handleSubmit = async () => {
        const body = {
            questions: [...questions, ...newQuestions].filter(q => q.trim() !== ''),
        };

        console.log("Submitting the following data:", body);
        alert(JSON.stringify(body, null, 2)); // Display the data to confirm submission
        setQuestions(body.questions); // Update the questions state
        setNewQuestions(['']); // Clear new questions
        onClose();
    };

    const handleAddQuestion = () => {
        setNewQuestions(prev => [...prev, '']); // Add a new empty string for a new question input
    };

    const handleNewQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...newQuestions];
        updatedQuestions[index] = value;
        setNewQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = (index: number) => {
        const updatedQuestions = newQuestions.filter((_, i) => i !== index);
        setNewQuestions(updatedQuestions); // Update the questions list
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                <button className="absolute top-2 right-2 text-black text-3xl" onClick={onClose}>
                    &times;
                </button>
                <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                    <h1 className="text-lg text-black font-semibold text-center">
                        Please click `Submit` to save all questions.
                    </h1>
                </div>

                <h2 className="text-md mt-4 text-black font-bold">Enter Team Evaluation Form Questions:</h2>
                {newQuestions.map((question, index) => (
                    <div className="flex items-start mt-2" key={index}>
                        <span className="text-black">Q{index + questionCount}: </span>
                        <textarea
                            value={question}
                            onChange={(e) => handleNewQuestionChange(index, e.target.value)}
                            className="border border-gray-400 rounded-lg w-full p-1 text-gray-800 ml-2 resize-none" 
                            rows={3} 
                            placeholder="What is your question?"
                            style={{ overflow: 'auto', resize: 'none' }} 
                        />
                        <button 
                            onClick={() => handleDeleteQuestion(index)} 
                            className="text-black ml-2 flex items-center"
                        >
                            <FaTrash /> {/* Delete icon */}
                        </button>
                    </div>
                ))}

                <div className="flex justify-center mt-2">
                    <button 
                        onClick={handleAddQuestion}
                        className="bg-yellow-400 text-white rounded-lg py-2 px-4 flex items-center justify-center"
                    >
                        <FaPlus className="mr-2" /> 
                        Add More Question
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

export default QuestionModal;
