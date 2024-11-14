"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Answer } from "@/app/api/issueSystem/createIssue/route";


import { FaArrowLeft } from "react-icons/fa";
import FileDisplay from "./imageKit/FileDisplay";


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

interface Question {
    question: string;
}

export default function StudentComment() {
    // Define state for the form inputs
    const params = useSearchParams();

    const issueId = params.get("issueId");
    const studentId = params.get("studentId");
    const studentName = params.get("studentName");

    const [formData, setFormData] = useState<FormData>({
        answers: [],
        questions: [],
        fileLinks: [],
    });

    /* const dummyQuestions: Question[] = [
        { question: "What is the weather like?", answer: "The weather is sunny and warm." },
        { question: "What did you learn from the project?", answer: "I learned how to work effectively in a team." }
    ];*/

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
                    let filesUrls = studentComment.filesUrl.split(",");
                    const filesNames = studentComment.filesName.split(",");
                    filesUrls = filesUrls.slice(0, -1);



                    const newFormData = {
                        answers: studentComment.answers.map((answer : Answer ) => ({ 
                            answer: String(answer.answer),
                        })),
                        questions: student.questions,
                        fileLinks: filesUrls.map((url: string, index: number) => ({
                            url,
                            name: filesNames[index] || "Unnamed File", // Providing a default name if filesNames has fewer entries
                        })),
                    };
                    console.log("newFormData:" + JSON.stringify(newFormData));
                    setFormData(newFormData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getIssueInfo();
    }, [issueId, studentId]);

    return (
        <div className="min-h-screen bg-gray-100">
                
            <div className="bg-yellow-400 p-6 w-full text-center justify-between">
                <button onClick={() => window.history.back()} className="text-black flex items-center ">
                    <FaArrowLeft className="mr-2" />
                    {"Back"}
                </button>
                <h1 className="text-black text-3xl font-bold">Team Evaluation Form For {studentName}</h1>
            </div>
            
            <div className="flex flex-col gap-6 p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">
    

                {formData.questions.map((q, index) => (
                    <div key={index} className="mt-4">
                        <label className="text-lg text-black block mb-2">
                            {index + 1}. {q.question}
                        </label>
                        <textarea
                            className="border border-gray-300 text-black p-2 rounded-md h-20 w-full mt-2"
                            readOnly
                            value={formData.answers[index].answer}
                        />
                    </div>
                ))}
                <label className="text-lg text-black block mb-2">3. Supported files.</label>
                <div className="mt-4">
                    {formData.fileLinks.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                            <FileDisplay fileName={file.name} fileUrl ={file.url}/>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
    
}
