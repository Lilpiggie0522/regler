"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Student } from "./unifiedInfo";
import { Button } from "react-bootstrap";

interface IssueStudent extends Student {
    comment: StudentComment;
}

interface StudentComment {
    title: string;
    content: string;
    filesUrl: string;
    student: string;
    filesName: string;
}

interface FormData {
	teamMembers: string;
	situationExplanation: string;
	fileLinks: { url: string; name: string }[];
}

export default function StudentComment() {
    // Define state for the form inputs
    const params = useSearchParams();
    const teamId = params.get("teamId");
    const studentId = params.get("studentId");
    const studentName = params.get("studentName");

    const [formData, setFormData] = useState<FormData>({
        teamMembers: "",
        situationExplanation: "",
        fileLinks: [],
    });

    useEffect(() => {
        async function getIssueInfo() {
            try {
                const response = await fetch(`/api/issueSystem/getIssueInfo/${teamId}`);
                if (!response.ok) {
                    alert("Error: " + response.statusText);
                } else {
                    const students = await response.json();
                    console.log(students.studentIssueInfos);
                    const student : IssueStudent = students.studentIssueInfos.find((student: IssueStudent) =>
                        student.comment.student === studentId
                    );
                    const studentComment : StudentComment = student.comment;
                    console.log("studentComment:" + studentComment);
                    console.log(studentComment.filesUrl);
                    console.log(studentComment.filesName);
                    console.log(studentComment.content);
                    let filesUrls = studentComment.filesUrl.split(",");
                    const filesNames = studentComment.filesName.split(",");
                    filesUrls = filesUrls.slice(0, -1);
                    const newFormData = {
                        teamMembers: studentComment.title,
                        situationExplanation: studentComment.content,
                        fileLinks: filesUrls.map((url: string, index: number) => ({
                            url,
                            name: filesNames[index] || "Unnamed File", // Providing a default name if filesNames has fewer entries
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
    }, [teamId, studentId]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="bg-yellow-400 p-9 w-full text-center">
                <h1 className="text-black text-3xl font-bold">Team Evaluation Form For {studentName}</h1>
            </div>
    
            <div className="max-w-7xl w-full p-8 mt-6 bg-white rounded-lg shadow-md">
                <label className="text-lg text-black block mb-2">
                    1. Please write members of your team and give them a mark between 1 and 10. 1 being the worst case, and 10 being the best case.
                </label>
                <textarea
                    name="teamMembers"
                    className="border border-gray-300 text-black p-2 rounded-md h-20 w-full mb-4"
                    value={formData.teamMembers}
                    readOnly
                />
    
                <label className="text-lg text-black block mb-2">
                    2. Please explain the situation.
                </label>
                <textarea
                    name="situationExplanation"
                    className="border border-gray-300 text-black p-2 rounded-md h-28 w-full mb-4"
                    value={formData.situationExplanation}
                    readOnly
                />
    
                <label className="text-lg text-black block mb-2">3. You can view your files here.</label>
                <div className="mt-4">
                    {formData.fileLinks.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                            <Button
                                variant="link"
                                onClick={() => window.open(file.url, "_blank")}
                                className="text-blue-600 underline bg-transparent border-none cursor-pointer"
                            >
                                {file.name}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}
