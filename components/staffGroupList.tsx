"use client";

import { useLocalStorageState } from "@/context/studentContext";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaArrowLeft, FaFilter, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import AssessmentModal from "./modals/staffAssessmentModal";
import QuestionModal from "./modals/staffQuestionModal";
import LogoutButton from "./logoutButton";

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
    assignment: string;
}

const GroupList: React.FC = () => {
    const router = useRouter();
    const params = useSearchParams();
    

    const courseId = params.get("courseId");
    const [, setIssueId] = useLocalStorageState("issueId", "")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [email,] = useLocalStorageState("email", "");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<GroupStatus | "">("");
    const [selectedAss, setSelectedAss] = useState<string>("");
    const [isAssDropdownOpen, setIsAssDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const assDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    const [groups, setGroups] = useState<Group[]>([]); // State for groups
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    // Random color classes for assessments
    const getAssColor = (Ass: string): string => {
        if (Ass === "N/A") {
            return "bg-gray-200 text-gray-700 border border-gray-500";
        } else {
            return "bg-yellow-400 text-black border border-black";
        }
    };

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

    const uniqueAssignments = Array.from(new Set(groups.map(group => group.assignment || "N/A")));

    // Filter groups based on the search term and status filter
    const filteredGroups = groups.filter(group => {
        const matchesTeam = group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMentors = group.tutors.split(",").map(tutor => tutor.toLowerCase()).includes(searchTerm.toLowerCase())

        const matchesSearchTerm = matchesTeam || matchesMentors;
        const matchesAss = selectedAss 
        ? (selectedAss === "N/A" ? (!group.assignment || group.assignment === "N/A") : group.assignment === selectedAss) 
        : true;

        const matchesStatus = selectedStatus ? group.status === selectedStatus : true;

        return matchesSearchTerm && matchesStatus && matchesAss;
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
            return "bg-green-200 text-green-700 border border-green-500";
        case GroupStatus.Pending:
            return "bg-orange-200 text-orange-700 border border-orange-500";
        case GroupStatus.NotStarted:
            return "bg-gray-200 text-gray-700 border border-gray-500";
        case GroupStatus.NeedFeedback:
            return "bg-blue-200 text-blue-700 border border-blue-500";
        default:
            return "";
        }
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assDropdownRef.current && !assDropdownRef.current.contains(event.target as Node)) {
                setIsAssDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [assDropdownRef, statusDropdownRef]);
    

    const handleSelectGroup = (group : Group) => {
        setIssueId(group.issueId ? group.issueId : "");
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
                    <h1 className="text-black text-3xl font-bold inline-block ml-6">Group Requests</h1>
                </div>
                <div className="flex items-center">
                    
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

            <div className="bg-gray-100 p-2 pr-9 flex justify-end items-center shadow-md">
                <button 
                    className="bg-black text-white py-1 px-4 rounded-lg flex items-center justify-center mr-4 space-x-1" 
                    onClick={() => {
                        setShowAssessmentModal(true);
                        setSelectedCourseId(courseId);
                    }}
                >
                        <FaEdit size={20} /> <span>Edit Assessments</span>
                </button>
                
                <div className="flex items-center">
                    <button 
                        className="bg-black text-white py-1 px-4 rounded-lg flex items-center justify-center mr-4 space-x-1" 
                        onClick={() => {
                            setShowQuestionModal(true);
                            setSelectedCourseId(courseId);
                        }}
                    >
                        <FaEdit size={20} /> <span>Edit Questions</span>
                    </button>
                </div>
                <LogoutButton />
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
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr >
                        <th className="py-2 px-4 font-bold text-black text-center w-1/5">Group Name</th>
                        <th className="py-2 px-4 font-bold text-black text-center w-1/5">Tutors</th>
                            <th className="py-2 px-4 font-bold text-black text-center w-1/5">
                            <div className="flex items-center justify-center cursor-pointer" onClick={() => setIsAssDropdownOpen(!isAssDropdownOpen)}>
                                <span>Assessment</span>
                                <FaFilter className="ml-2" />
                            </div>

                                {isAssDropdownOpen && (
                                    <div
                                        ref={assDropdownRef}
                                        className="absolute w-55 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                    >
                                        {/* Assignment options */}
                                        {uniqueAssignments.map((assignment) => (
                                            <div
                                                key={assignment}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md ${getAssColor(assignment)} ${selectedAss === assignment ? "bg-gray-200 text-gray-700 border border-gray-500" : ""}`}
                                                onClick={() => {
                                                    setSelectedAss(assignment);
                                                    setIsAssDropdownOpen(false);
                                                }}
                                            >
                                                {assignment}
                                            </div>
                                        ))}

                                        {/* Clear option */}
                                        <div
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                setSelectedAss(""); // Clear the selected assessment
                                                setIsAssDropdownOpen(false);
                                            }}
                                        >
                                            Clear
                                        </div>
                                    </div>
                                )}
                            </th>

                            <th className="py-2 px-4 font-bold text-black text-center w-1/5">
                            <div className="flex items-center justify-center cursor-pointer" onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}>
                                <span>Status</span>
                                <FaFilter className="ml-2" />
                            </div>

                                {isStatusDropdownOpen && (
                                    <div
                                        ref={statusDropdownRef}
                                        className="absolute w-55 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                    >
                                        {/* Status options */}
                                        {Object.values(GroupStatus).map((status) => (
                                            <div
                                                key={status}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md ${getStatusClass(status)} ${selectedStatus === status ? "bg-gray-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedStatus(status);
                                                    setIsStatusDropdownOpen(false);
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
                                                setIsStatusDropdownOpen(false);
                                            }}
                                        >
                                            Clear
                                        </div>
                                    </div>
                                )}
                            </th>
                            <th className="py-2 px-4 font-bold text-black text-center w-1/5">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGroups.length > 0 ? (
                            sortedGroups.map((group, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-3 px-4 text-black text-center w-1/5">{group.groupName}</td>
                                    <td className="py-3 px-4 text-black text-center w-1/5">
                                        {group.tutors}
                                    </td>

                                    <td className="py-3 px-4 text-center w-1/5">
                                        <div className={`inline-block px-4 py-1 border-2 items-center justify-center rounded-md ${group.assignment ? getAssColor(group.assignment) : "bg-gray-200 text-gray-700 border border-gray-500"}`} style={{
                                                width: "140px",
                                                height: "auto",
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                            }}>
                                            {group.assignment ? group.assignment : "N/A"}
                                        </div>
                                    </td>

                                    <td className="py-3 px-4 text-center w-1/5">
                                        <div className={`inline-block px-4 py-1 border-2 items-center justify-center rounded-md ${getStatusClass(group.status)}`} style={{ width: "140px", height: "35px",  }}>
                                            {group.status}
                                        </div>
                                    </td>

                                    <td className="py-3 px-4 text-center w-1/5">
                                        <button
                                            className="bg-black text-white py-1 px-3 rounded-lg"
                                            onClick={() => handleSelectGroup(group)}
                                        >
                                            Select
                                        </button>
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