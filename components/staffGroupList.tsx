"use client";

import { useStudentContext } from "@/context/studentContext";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaArrowLeft, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import AssessmentModal from "./modals/staffAssessmentModal";
import QuestionModal from "./modals/staffQuestionModal";

// Define an enum for the group statuses
enum GroupStatus {
    NeedFeedback = "Need Feedback",
    Pending = "Pending",
    Complete = "Complete",
    NotStarted = "Not Started",
}

// Define a type for the group
interface Group {
    groupName: string;
    lecturer: string;
    status: GroupStatus;
    tutors: string;
    teamId: string;
    issueId: string;
}

const GroupList: React.FC = () => {
    const router = useRouter();
    const params = useSearchParams();
    

    const courseId = params.get("courseId");
    const { useLocalStorageState } = useStudentContext();
    const [, setIssueId] = useLocalStorageState("issueId", "")



    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [email,] = useLocalStorageState("email", "");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<GroupStatus | "">("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [groups, setGroups] = useState<Group[]>([]); // State for groups
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);


    // Fetch groups from the API
    const fetchTeams = async (courseId: string|null) => {
        try {
            // should return a list of teams in this course
            const res = await fetch(`/api/util/getTeamsByCourseId/${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!res.ok) {
                const errObj = await res.json();
    
                throw Error(errObj.error);
            }

            const groupObj = await res.json();
            console.log(groupObj.teams);
            setGroups(groupObj.teams);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }

    useEffect(() => {
        
        fetchTeams(courseId);
    }, [courseId]);  // Run effect when these values change

    

    // Filter groups based on the search term and status filter
    const filteredGroups = groups.filter(group => {
        const matchesTeam = group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMentors = group.tutors.split(",").map(tutor => tutor.toLowerCase()).includes(searchTerm.toLowerCase())
        const matchesLecturer = group.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearchTerm = matchesTeam || matchesMentors || matchesLecturer;

        const matchesStatus = selectedStatus ? group.status === selectedStatus : true;

        return matchesSearchTerm && matchesStatus;
    });


    // Define the order of statuses for sorting
    const statusOrder: Record<GroupStatus, number> = {
        [GroupStatus.NeedFeedback]: 1,
        [GroupStatus.Pending]: 2,
        [GroupStatus.Complete]: 3,
        [GroupStatus.NotStarted]: 4,
    };


    // Sort the filtered groups based on status
    const sortedGroups = filteredGroups.sort((a, b) => {
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    });

    // Get the corresponding class for the status
    const getStatusClass = (status: GroupStatus): string => {
        switch (status) {
        case GroupStatus.Complete:
            return "bg-green-400 text-white border-xl border-green-700";
        case GroupStatus.Pending:
            return "bg-orange-400 text-white border-xl border-orange-700";
        case GroupStatus.NotStarted:
            return "bg-gray-400 text-white border-xl border-gray-700";
        case GroupStatus.NeedFeedback:
            return "bg-blue-400 text-white border-xl border-blue-700";
        default:
            return "";
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSelectGroup = (group : Group) => {
        setIssueId(group.issueId);
        router.push(`/unifiedInfo?&group=${group.groupName}&teamId=${group.teamId as string}`);
        
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Title */}
            <div className="bg-yellow-400 p-6 flex items-center justify-between">
                <div>
                    {/* Back arrow icon */}
                    <button onClick={() => window.history.back()} className="text-black mb-2 flex items-center ">
                        <FaArrowLeft className="mr-2" />
                        {"Back"}
                    </button>
                    <h1 className="text-black text-3xl font-bold inline-block ml-6">Groups</h1>
                </div>
                    <div className="flex items-center">
                        <button 
                            className="bg-black text-white py-1 px-4 rounded-lg mr-4" 
                            onClick={() => {
                                setShowAssessmentModal(true);
                                setSelectedCourseId(courseId);
                            }}
                        >
                            Edit Assessments
                        </button>
                    
                    <div className="flex items-center">
                        <button 
                            className="bg-black text-white py-1 px-4 rounded-lg mr-4" 
                            onClick={() => {
                                setShowQuestionModal(true);
                                setSelectedCourseId(courseId);
                            }}
                        >
                            Edit Questions
                        </button>
                    </div>
                    {/* Search bar section */}
                    <div className="relative flex items-center">
                        <span className="absolute left-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search"
                            className="border border-gray-400 pl-10 pr-4 py-1 rounded-full text-gray-800" // Added padding left to accommodate icon
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>


            </div>

            {showAssessmentModal && (
                <AssessmentModal
                    courseId={selectedCourseId}
                    onClose={() => setShowAssessmentModal(false)} 
                />
            )}

            {showQuestionModal && (
                <QuestionModal
                    courseId={selectedCourseId}
                    onClose={() => setShowQuestionModal(false)} 
                />
            )}

            {/* Table */}
            <div className="flex flex-col p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr className="text-left mt-6">
                            <th className="py-2 px-4 font-bold text-black text-center">Group Name</th>
                            <th className="py-2 px-4 font-bold text-black text-center">Lecturer</th>
                            <th className="py-2 px-4 font-bold text-black text-center">Tutors</th>
                            <th className="py-2 px-4 font-bold text-black text-center flex items-center justify-center">
                                <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <span>Status</span>
                                    <FaFilter className="ml-2" />
                                </div>

                                {isDropdownOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute w-55 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                        style={{ marginTop: "100px" }}
                                    >

                                        {/* Status options */}
                                        {Object.values(GroupStatus).map((status) => (
                                            <div
                                                key={status}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md ${getStatusClass(status)} ${selectedStatus === status ? "bg-gray-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedStatus(status);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {status}
                                            </div>
                                        ))}

                                        {/* Clear option */}
                                        <div
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                setSelectedStatus(""); // Clear the selected status
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            Clear
                                        </div>
                                    </div>
                                )}
                            </th>
                            <th className="py-2 px-4 font-bold text-black text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGroups.length > 0 ? (
                            sortedGroups.map((group, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-3 px-4 text-black text-center">{group.groupName}</td>
                                    <td className="py-3 px-4 text-black text-center">
                                        {group.lecturer}
                                    </td>
                                    <td className="py-3 px-4 text-black text-center">
                                        {group.tutors}
                                    </td>
                                    <td className="py-3 px-4 flex justify-center items-center">
                                        <div className={`flex items-center justify-center ${getStatusClass(group.status)}`} style={{ width: "140px", height: "35px", borderRadius: "8px" }}>
                                            {group.status}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="bg-black text-white py-1 px-3 rounded-lg"
                                            onClick={() => handleSelectGroup(group)}
                                        >Select</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GroupList;