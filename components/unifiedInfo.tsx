"use client"
import { useLocalStorageState } from "@/context/studentContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ErrorModal from "./modals/errorModal";
import ConfirmModal from "./modals/confirmModal";
import { FaArrowLeft, FaTrash, FaInfoCircle } from "react-icons/fa";
import LogoutButton from "./logoutButton";

export interface Student {
    id: string;
    name: string;
    class: string;
    zid: string;
    email: string;
    status: "Submitted" | "No Submission";
}

export default function UnifiedInfo() {
    const router = useRouter();
    
    const params = useSearchParams()

    const teamId = params.get("teamId")
    const group = params.get("group");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [content, setContent] = useState<string>("")
    const [tutorComment, setTutorComment] = useState<[]>([])
    const [lectureComment, setLecturerComment] = useState<[]>([])
    const [staffId,] = useLocalStorageState("staffId", "");
    const [issueId,] = useLocalStorageState("issueId", "");
    const [role,] = useLocalStorageState("role", "")
    const [students, setStudents] = useState<Student[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useEffect(() => {
        if (role === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [role])

    useEffect(() => {
        async function getTutorOpinions() {
            try {
                const response = await fetch(`/api/util/getIssueById/${issueId}`)
                if (!response.ok) {
                    const error = await response.json();
                    console.log(error)
                } else {
                    const comment = await response.json()
                    setTutorComment(comment.tutorComments);
                    setLecturerComment(comment.lecturerComments)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getTutorOpinions()
    }, [issueId])

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
                body: JSON.stringify({content: content, issueId, staffId: staffId})
                
            });
            if (!response.ok) {
                const errorString = await response.json();
                setErrorMessage(errorString.error);
                setShowError(true);
            }else {
                const successPrompt = await response.json()
                setErrorMessage(successPrompt.message);
                setShowError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseIssue = async () => {
        try {
            const response = await fetch("/api/issueSystem/closeIssue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ issueId, adminId: staffId })
            });

            if (response.ok) {
                setErrorMessage("Issue closed successfully");
                setShowError(true);
            } else {
                const errorString = await response.json();
                setErrorMessage(errorString.error);
                setShowError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmModal(false); 
        handleCloseIssue(); 
    };
    
    const handleCloseClick = () => setShowConfirmModal(true); 
    const handleCancelClose = () => setShowConfirmModal(false); 

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

            <div className="bg-gray-100 p-2 pr-9 flex justify-end items-center shadow-md">
                <LogoutButton />
            </div>

            <div className="max-w-7xl mx-auto p-8 bg-white text-black mt-6 rounded-lg shadow-md">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr className="text-left">
                            <th className="px-4 py-2 text-center w-1/7 font-bold ">Members</th>
                            <th className="px-4 py-2 text-center w-1/7 font-bold ">Class</th>
                            <th className="px-4 py-2 text-center w-1/7 font-bold ">ZID</th>
                            <th className="px-4 py-2 text-center w-1/7 font-bold ">Email</th>
                            <th className="px-4 py-2 text-center w-1/7 font-bold ">Status</th>
                            <th className="px-4 py-2 text-left w-1/7 font-bold pl-9">Details</th>
                            <th className="px-4 py-2 text-left w-1/7 font-bold pl-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="border-b align-content-center">
                                <td className="px-4 py-2 text-center w-1/7">{student.name}</td>
                                <td className="px-4 py-2 text-center w-1/7">{student.class}</td>
                                <td className="px-4 py-2 text-center w-1/7">{student.zid}</td>
                                <td className="px-4 py-2 text-center w-1/7">{student.email}</td>
                                {/* <td className={`py-2 `}>
                                    {student.status}
                                </td> */}
                                <td className="px-4 py-2 text-center w-1/7">
                                    <div
                                        className={`inline-block px-4 py-1 border-2 items-center justify-center rounded-md ${
                                            student.status === "Submitted"
                                                ? "bg-green-200 text-green-700 border-green-500"
                                                : "bg-red-200 text-red-700 border-red-500"
                                        }`}
                                        style={{ width: "150px", height: "35px" }}
                                    >
                                        {student.status}
                                    </div>
                                </td>

                                <td className="px-4 py-2 text-center w-1/7 align-items-center">
                                    {/* "bg-blue-500 text-white py-1 px-3 rounded" */}
                                    <button
                                        className={`bg-blue-500 text-white py-1 px-3 rounded flex items-center justify-center space-x-1 ${issueId ? "" : "opacity-50 cursor-not-allowed"}`}
                                        onClick={() => router.push(`/studentComment?studentId=${student.id}&issueId=${issueId}&studentName=${student.name}`)}
                                        disabled={!issueId}
                                    >
                                        <FaInfoCircle />
                                        <span>Details</span>
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center w-1/7 align-items-center">
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded flex items-center justify-center space-x-1"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <FaTrash /> 
                                        <span>Delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-4 mt-6">
                    <h2 className="font-semibold">Tutor Opinions</h2>
                    {tutorComment.length ? tutorComment.map((opinion: {name: string, content: string}, index: number) => (
                        <div key={index} className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">{opinion.name}:</span>
                            <p className="text-black">{opinion.content}</p>
                        </div>
                    )):"No tutor comments"}
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-4">
                    <h2 className="font-semibold">Lecturer Opinions</h2>
                    {lectureComment.length ? lectureComment.map((opinion: {name: string, content: string}, index) => (
                        <div key={index} className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">{opinion.name}:</span>
                            <p className="text-black">{opinion.content}</p>
                        </div>
                    )) : "No lecturer comments"}
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
                            {isAdmin && issueId && (
                                <button
                                    type="button" onClick={handleCloseClick} className="bg-red-600 text-white py-2 w-40 rounded-md">
                                    Close this issue
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {showError ? (
                    <ErrorModal
                        errorMessage={errorMessage}
                        onClose={() => {
                            setShowError(false)
                            window.location.reload()
                        }}
                    />
                ) : null}

                {showConfirmModal && (
                    <ConfirmModal
                        message="Are you sure you want to close this issue?"
                        onConfirm={handleConfirmClose}
                        onCancel={handleCancelClose}
                        onClose={handleCancelClose}
                    />
                )}

            </div>
        </div>
    );
};