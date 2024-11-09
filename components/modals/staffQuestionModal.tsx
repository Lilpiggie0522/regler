"use client";
import React, { useEffect, useState } from 'react';
import { FaTrash, FaUndo, FaPlus } from 'react-icons/fa';
import { QuestionModalProps } from './ModalProps';
import ErrorModal from "./errorModal";

const QuestionModal: React.FC<QuestionModalProps> = ({ onClose, courseId }) => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [newQuestions, setNewQuestions] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [questionsToDelete, setQuestionsToDelete] = useState<string[]>([]);

    // Fetch existing questions from the database
    useEffect(() => {
        const fetchQuestions = async (courseId: string | null) => {
            try {
                const res = await fetch(`/api/adminSystem/courses/setCourseQuestions/${courseId}`, {
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
                const fetchedQuestions = data.questions.map((questionList: { question: string }) => questionList.question);

                console.log(fetchedQuestions);
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to fetch questions. Please try again.');
                setShowErrorModal(true);
            }
        }

        fetchQuestions(courseId);
    }, [courseId]);

    const handleSubmit = async () => {
        const updatedQuestions = questions.filter(question => !questionsToDelete.includes(question)); // Remove deleted questions

        // Add new question if it exists
        if (newQuestions.trim()) {
            updatedQuestions.push(newQuestions.trim());
        }

        // Prepare the request body with the updated list of questions
        const body = {
            questions: updatedQuestions.map(question => ({
                question: question, 
            })),
        };

        console.log("Submitting the following data:", body);

        try {
            const response = await fetch(`/api/adminSystem/courses/setCourseQuestions/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errObj = await response.json();
                console.error("Error Response:", errObj);
                throw Error(errObj.error);
            }

            setQuestions(updatedQuestions);
            setNewQuestions('');
            setQuestionsToDelete([]);

            setErrorMessage('Questions have been successfully update.');
            setShowErrorModal(true);      
        } catch (error) {
            setErrorMessage('Failed to update questions. Please try again.');
            console.error("Submission Error:", error);
            setShowErrorModal(true);
        }
    };

    const handleAddQuestion = () => {
        if (newQuestions.trim()) {
            setQuestions(prev => [...prev, newQuestions.trim()]);
            setNewQuestions('');
        }
    };

    const handleDelete = (question: string) => {
        if (!questionsToDelete.includes(question)) {
            setQuestionsToDelete(prev => [...prev, question]);
        }
    };

    const handleUndoDelete = (question: string) => {
        setQuestionsToDelete(prev => prev.filter(p => p !== question));

        setQuestions(prev => {
            if (!prev.includes(question)) {
                return [...prev, question];
            }
            return prev;
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                <button className="absolute top-2 right-2 text-black text-3xl" onClick={onClose}>
                    &times;
                </button>
                <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                    <h1 className="text-lg text-black font-semibold text-center">
                        Please click `Submit` to save all of your changes on Team Evaluation Form Questions.
                    </h1>
                </div>

                <h2 className="text-md mt-4 text-black font-bold">Current Questions</h2>
                <div className="flex flex-col mt-4">
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <div key={question} className={`flex items-center justify-between mb-1 ${questionsToDelete.includes(question) ? 'opacity-50 line-through text-black' : ''}`}>
                                <div className="bg-yellow-400 text-black rounded-md px-4 py-1 break-all">
                                    {question}
                                </div>
                                <div className="flex items-center">
                                    <button className="text-black p-1" onClick={() => handleDelete(question)}>
                                        <FaTrash />
                                    </button>

                                    {questionsToDelete.includes(question) && (
                                        <button className="text-black p-1" onClick={() => handleUndoDelete(question)}>
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

                <h2 className="text-md mt-4 text-black font-bold">Enter New Questions</h2>
                <div className="flex items-center mt-2">
                    <textarea
                        value={newQuestions}
                        onChange={(e) => setNewQuestions(e.target.value)}
                        className="border border-gray-400 rounded-lg w-full p-1 text-gray-800 ml-2 resize-none"
                        rows={3}
                        placeholder="What is your question?"
                        style={{ overflow: 'auto', resize: 'none' }}
                    />
                    <button 
                        onClick={handleAddQuestion}
                        className="bg-yellow-400 text-white rounded-lg ml-2 px-2 py-2"
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

export default QuestionModal;