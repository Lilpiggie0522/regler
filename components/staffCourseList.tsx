'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';

import { useStudentContext } from '@/context/studentContext';
import { useRouter } from 'next/navigation';
import ErrorModal from "@/components/modals/errorModal";

interface Course {
    id: string;
    course: string;
    term: string;
}

interface DisplayData {
    name: string,
    zid: string;
    groupname: string,
    class: string;
    group_id: string;
    group_id2: string;
    mentor: string;
    mentor_email:string;
    email: string
}

export default function CourseList() {
    const router = useRouter();
    
    const { useLocalStorageState } = useStudentContext();
    const [email,] = useLocalStorageState('email', '');
    // const [,setCourse] = useLocalStorageState('email', '');
    // const [,setTerm] 
    
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortedCourses, setSortedCourses] = useState<Course[]>([]);
    const [coursesData, setCoursesData] = useState<Course[]>([]);

    // import csv
    const [displayData, setDisplayData] = useState<DisplayData[]>([]);
    const [showData, setShowData] = useState<boolean>(false);
    const [showWindow, setShowWindow] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
    const [uploading, setUploading] = useState<boolean>(false);

    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (email) {
            fetchCourses(email);
            }
        }, [email]);  // Run effect when these values change
        
        const fetchCourses = async (email: string) => {
            try {
                const coursesResponse = await fetch('/api/staff/courseList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (!coursesResponse.ok) {
                    const errObj = await coursesResponse.json();
                    throw Error(errObj.error);
                }
                const courseObj = await coursesResponse.json();

                courseObj.courses.forEach((course: Course) => {
                    console.log("Course Term:", course.term);
                });

                setCoursesData(courseObj.courses);
                // console.log("courses data:", courseObj.courses);
                
            } catch (error) {
                setErrorMessage("Failed to fetch courses. Please try again.");
                setShowErrorModal(true);
                throw error
            }
        }


    useEffect(() => {
        const sorted = [...coursesData].sort((a, b) => {

        // same term, course code 
        if (a.course < b.course) return -1;
        if (a.course > b.course) return 1;

        return 0;
        });

        setSortedCourses(sorted);
    }, [coursesData]);

    // searching filter
    const filteredCourses = sortedCourses.filter((course) =>
        course.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.term.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function cancelFile() {
        const fileInput = document.getElementById("csv") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ""; // Clear the input value???
            setShowData(false)
            setSelectedFile(null)
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file: File | undefined = e.target.files?.[0];
        if (file) {
            // alert('form data sent')
            setSelectedFile(file)
        }
    };

    function handleShowWindow(): void {
        setShowWindow(true)
    }

    function handleSubmit() {
        if (selectedFile) {
            setUploading(true)
            const formData: FormData = new FormData()
            formData.append('csv', selectedFile)
            sendData(formData)
        }
    }

    function handleCloseWindow() {
        setShowWindow(false)
    }

    function handleCloseData() {
        setShowData(false)
    }

    async function sendData(formData: FormData) {
        // console.log(results.data)
        try {
            const response = await fetch('api/staff/readCsv', {
                method: 'POST',
                body: formData
            })
            if (response.ok) {
                // alert("OK! Data sent and received")
                // setErrorMessage("Data has been sent and received");
                // setShowErrorModal(true);
                const displayData = await response.json()
                console.log(displayData)
                setShowData(true)
                setDisplayData(displayData)
                handleCloseWindow();
            } else {
                const error = await response.json()
                setErrorMessage(error);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Failed to send the CSV file. Please try again.");
            setShowErrorModal(true);
        }
        setUploading(false)
    }
    
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Title */}
            <div className="bg-yellow-400 p-9 flex justify-between items-center">
                <h1 className="text-black text-3xl font-bold">Courses</h1>
                <div className="flex items-center">
                    <button 
                        className="bg-black text-white py-1 px-4 rounded-lg mr-4" 
                        onClick={handleShowWindow}
                    >
                        Import CSV
                    </button>
                    
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
            </div>

            {showWindow && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-100 rounded-lg relative flex flex-col p-6 items-center justify-center">
                        <button className="absolute top-2 right-3 text-black text-3xl" onClick={handleCloseWindow}>
                            &times;
                        </button>
                        <div className="flex flex-col justify-center items-center rounded-lg">
                            <div className="flex p-5 text-black text-center">
                                <input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
                                {selectedFile && (
                                    <span className="ml-2 flex items-center">
                                        <FaTrash 
                                            className="ml-2 cursor-pointer" 
                                            onClick={cancelFile} 
                                            title="Remove file"
                                        />
                                    </span>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <button className="bg-black text-white py-1 px-4 rounded-lg mr-4" type="button" onClick={handleSubmit}>Submit</button>
                            </div>

                            {/* Centered loading message */}
                            {uploading && (
                                <div className="flex justify-center items-center h-16"> {/* Adjust height as needed */}
                                    <p className="text-black">Uploading file, please wait</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-100 max-h-[700px] w-[90vw] rounded-lg relative flex flex-col p-6 items-center justify-center">
                {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-100 max-h-[700px] w-[90vw] rounded-lg relative flex flex-col items-center justify-center"> */}
                        <button className="absolute top-2 right-3 text-black text-3xl" onClick={handleCloseData}>
                            &times;
                        </button>
                        <div className="p-5 text-black w-full overflow-y-scroll">
                            <p className="mb-4 text-lg font-bold text-left">
                            Your file "{selectedFile?.name}" has been successfully imported:
                            </p>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2">name</th>
                                        <th className="border border-gray-300 p-2">zid</th>
                                        <th className="border border-gray-300 p-2">groupName</th>
                                        <th className="border border-gray-300 p-2">class</th>
                                        <th className="border border-gray-300 p-2">mentor</th>
                                        <th className="border border-gray-300 p-2">group Id</th>
                                        <th className="border border-gray-300 p-2">group Id2</th>
                                        <th className="border border-gray-300 p-2">email</th>
                                        <th className="border border-gray-300 p-2">mentor_email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayData.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2">{row.name}</td>
                                            <td className="border border-gray-300 p-2">{row.zid}</td>
                                            <td className="border border-gray-300 p-2">{row.groupname}</td>
                                            <td className="border border-gray-300 p-2">{row.class}</td>
                                            <td className="border border-gray-300 p-2">{row.mentor}</td>
                                            <td className="border border-gray-300 p-2">{row.group_id}</td>
                                            <td className="border border-gray-300 p-2">{row.group_id2}</td>
                                            <td className="border border-gray-300 p-2">{row.email}</td>
                                            <td className="border border-gray-300 p-2">{row.mentor_email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* showLoginFail */}
            {showErrorModal ? (
                <ErrorModal
                errorMessage={errorMessage}
                onClose={() => setShowErrorModal(false)}
                />
            ) : null}

        {/* Table */}
            <div className="flex flex-col p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">
            <table className="min-w-full table-fixed">
            <thead className="bg-gray-200 sticky">
                <tr className="text-left">
                    <th className="w-1/3 py-2 px-4 font-bold text-black text-center">Course Code</th>
                    <th className="w-1/3 py-2 px-4 font-bold text-black text-center">Term</th>
                    <th className="w-1/3 py-2 px-4 font-bold text-black text-center">Action</th>
                </tr>
                </thead>

                <tbody>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                    <tr key={index} className="border-b border-gray-200">
                        <td className="w-1/3 py-3 px-4 text-black text-center">{course.course}</td>
                        <td className="w-1/3 py-3 px-4 text-black text-center">{course.term ? course.term : "No term available"}</td>
                        <td className="w-1/3 py-3 px-4 text-center">
                            <button 
                                className="bg-black text-white py-1 px-4 rounded-lg"
                                onClick={() => router.push(`/staffGroupList?courseId=${course.id}`)}
                            >Select</button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">No results found</td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
    );
}
