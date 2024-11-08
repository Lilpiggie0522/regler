"use client"
import { useLocalStorageState } from "@/context/studentContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ErrorModal from "./modals/errorModal";
import { FaArrowLeft } from "react-icons/fa";

export interface Student {
    id: string;
    name: string;
    class: string;
    zid: string;
    email: string;
    status: "Submitted" | "No Submission";
}

const dummyTutorOpinions = [
    { name: "Tutor A", content: "Great job on the project!" },
    { name: "Tutor B", content: "Needs improvement in teamwork." },
];

const dummyLecturerOpinions = [
    { name: "Lecturer X", content: "Excellent presentation skills." },
    { name: "Lecturer Y", content: "Could use more analytical depth." },
];

export default function UnifiedInfo() {
    const router = useRouter();
    
    const params = useSearchParams()

    const teamId = params.get('teamId')
    const group = params.get('group');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [content, setContent] = useState<string>('')
    const [tutorComment, setTutorComment] = useState<string>('')
    const [staffId,] = useLocalStorageState('staffId', '');
    const [issueId,] = useLocalStorageState('issueId', '');

    const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [isAdmin] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        async function getTutorOpinions() {
            try {
                const response = await fetch(`/api/util/getIssueByTeamId/${teamId}`)
                if (!response.ok) {
                    const error = await response.json();
                    const message = error.message;
                    // alert("Error: " + message);
                    setTutorComment(JSON.stringify(message).slice(1,).slice(0,-1));
                } else {
                    const comment = await response.json()

                    console.log("comment: " + comment)
                    console.log("tutorName: " + comment.tutorName)
                    setTutorComment(JSON.stringify(comment.tutorName + ": " + comment.tutorComment).slice(1,).slice(0,-1));
                    //加回去slice
                }
            } catch (error) {
                console.error(error);
            }
        }
        getTutorOpinions()
    }, [teamId, tutorComment, isUploadedSuccessfully])

    useEffect(() => {
        async function getIssueInfo() {
            try {
                
                const response = await fetch(`/api/issueSystem/getIssueInfo/${teamId}`)
                if (!response.ok) {
                    const errorString = await response.json();
                    setErrorMessage(errorString.error);
                    setShowError(true);
                } else {
                    const students = await response.json();
                    const studentInfos : Student[] = [];
                    if (students.studentIssueInfos !== undefined) {
                        for (const student of students.studentIssueInfos) {
                            console.log(student)
                            const studentInfo : Student = {
                                id : student.comment.student,
                                name: student.studentName,
                                class: group || "null",
                                zid: student.zid,
                                email: student.email,
                                status: student.isSubmitted === true? "Submitted" : "No Submission"
                            }
                            studentInfos.push(studentInfo);
                        }
                    }
                    setStudents(studentInfos);
                    const {message} = students
                    console.log("ksdjfakdjfksajfklszzzz")
                    console.log(message)
                }
            } catch (error) {
                console.error(error);
            }

        }
        getIssueInfo()
    }, [teamId, group])

    // Handle functions
    const handleDelete = (indexToDelete: number) => {
        const filteredStudents = students.filter((_, index) => {
            return index !== indexToDelete;
        });
        setStudents(filteredStudents);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("api/staff/tutorOpinions", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({content: content, teamId: teamId, staffId: staffId})
                
            });
            if (!response.ok) {
                const errorString = await response.json();
                setErrorMessage(errorString.error);
                setShowError(true);
                console.log(errorString);
                setIsUploadedSuccessfully(false);
            }else {
                setIsUploadedSuccessfully(true);
            }
        } catch (error) {
            console.error(error);
            setIsUploadedSuccessfully(false);
        }
    };

    const handleClose = () => {
        setErrorMessage("Close button clicked");
        setShowError(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-yellow-400 p-6 flex justify-between items-center">
                <div>
                    {/* Back arrow icon */}
                    <button onClick={() => window.history.back()} className="text-black mb-2 flex items-center ">
                        <FaArrowLeft className="mr-2" />
                        {"Back"}
                    </button>
                    <h1 className="text-black text-3xl font-bold inline-block ml-6">{group}</h1>
                </div>

                {/* Search bar section */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="absolute left-2 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-400 px-10 py-1 rounded-full text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8 bg-white text-black mt-6 rounded-lg shadow-md">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2">Members</th>
                            <th className="py-2">Class</th>
                            <th className="py-2">ZID</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Details</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2">{student.name}</td>
                                <td className="py-2">{student.class}</td>
                                <td className="py-2">{student.zid}</td>
                                <td className="py-2">{student.email}</td>
                                <td className={`py-2 ${student.status === "Submitted" ? "text-green-500" : "text-red-500"}`}>
                                    {student.status}
                                </td>
                                <td>
                                    
                                    <Button
                                        className="bg-blue-500 text-white py-1 px-3 rounded"
                                        onClick={() => router.push(`/studentComment?studentId=${student.id}&issueId=${issueId}&studentName=${student.name}`)}
                                    >
                                        Details
                                    </Button>
                                </td>
                                <td className="py-2">
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-4 mt-6">
                    <h2 className="font-semibold">Tutor Opinions</h2>
                    {dummyTutorOpinions.map((opinion, index) => (
                        <div key={index} className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">{opinion.name}:</span>
                            <p className="text-black">{opinion.content}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-4">
                    <h2 className="font-semibold">Lecturer Opinions</h2>
                    {dummyLecturerOpinions.map((opinion, index) => (
                        <div key={index} className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">{opinion.name}:</span>
                            <p className="text-black">{opinion.content}</p>
                        </div>
                    ))}
                </div>

                <form className="mt-6 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg text-black">Enter your opinion here</label>
                        <textarea
                            name="yourOpinion"
                            placeholder="Enter your opinion here"
                            className="border border-gray-300 text-black p-2 rounded-md h-20"
                            onChange={(input) => setContent(input.target.value)}
                            required
                        />
                        <div className="flex gap-4 justify-center">
                            <button type="submit" className="bg-black text-white py-2 w-40 rounded-md">
                                Submit
                            </button>
                            {isAdmin && (
                                <button
                                    type="button" onClick={handleClose} className="bg-black text-white py-2 w-40 rounded-md">
                                    Close this issue
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {showError ? (
                    <ErrorModal
                        errorMessage={errorMessage}
                        onClose={() => setShowError(false)}
                    />
                ) : null}

            </div>
        </div>
    );
};