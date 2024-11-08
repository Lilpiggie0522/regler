"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Answer, Question } from '@/app/api/issueSystem/createIssue/route';
//import { Button } from 'react-bootstrap';

interface IssueStudent {
    studentName: string;
    email: string;
    comment: StudentComment;
    questions: Question[]
}

interface StudentComment {
    
    filesUrl: string;
    student: string;
    filesName: string;
    answers: Answer[];
}

interface FormData {
    answers: Answer[],
    questions: Question[],
	fileLinks: { url: string; name: string }[];
}

export default function StudentComment() {
    // Define state for the form inputs
    const params = useSearchParams();
    const issueId = params.get('issueId');
    const studentId = params.get('studentId');
    const studentName = params.get('studentName');

    const [formData, setFormData] = useState<FormData>({
        answers: [],
        questions: [],
        fileLinks: [],
    });

    useEffect(() => {
        async function getIssueInfo() {
            try {
                const response = await fetch(`/api/issueSystem/getIssueInfo/studentComment/${issueId}/${studentId}`);
                if (!response.ok) {
                    alert("Error: " + response.statusText);
                } else {
                    const studentData = await response.json();
                    console.log(studentData.studentResponse);
                    const student : IssueStudent = studentData.studentResponse
                    const studentComment : StudentComment = student.comment;
                    console.log("studentComment:" + studentComment);
                    console.log(studentComment.filesUrl);
                    console.log(studentComment.filesName);
                    console.log(studentComment.answers);
                    let filesUrls = studentComment.filesUrl.split(',');
                    const filesNames = studentComment.filesName.split(',');
                    filesUrls = filesUrls.slice(0, -1);
                    const newFormData = {
                        answers: studentComment.answers,
                        questions: student.questions,
                        fileLinks: filesUrls.map((url: string, index: number) => ({
                            url,
                            name: filesNames[index] || 'Unnamed File', // Providing a default name if filesNames has fewer entries
                        })),
                    };
                    console.log("newFormData:" + newFormData);
                    setFormData(newFormData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getIssueInfo();
    }, [issueId, studentId]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="bg-yellow-400 p-9 w-full text-center">
                <h1 className="text-black text-3xl font-bold">Team Evaluation Form For {studentName}</h1>
            </div>
    
            <div className="max-w-7xl w-full p-8 mt-6 bg-white rounded-lg shadow-md">
    
                <label className="text-lg text-black block mb-2">3. You can view your files here.</label>
                <div className="mt-4">
                    {formData.fileLinks.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {file.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}
