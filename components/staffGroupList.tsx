'use client';

import { useStudentContext } from '@/context/studentContext';
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { useRouter } from 'next/router';

// Define an enum for the group statuses
enum GroupStatus {
    NeedFeedback = 'Need Feedback',
    Pending = 'Pending',
    Complete = 'Complete',
    NotStarted = 'Not Started',
}

// Define a type for the group
interface Group {
    team: string;
    mentors: string[];
    status: GroupStatus;
}
  
const GroupList: React.FC = () => {
    const router = useRouter();
    const { course, term } = router.query;
    const courseString = Array.isArray(course) ? course[0] : course;
    const termString = Array.isArray(term) ? term[0] : term;

    const { useLocalStorageState } = useStudentContext();
    const [email,] = useLocalStorageState('email', '');
    console.log("email:", email);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<GroupStatus | ''>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [groups, setGroups] = useState<Group[]>([]); // State for groups

    // const groups: Group[] = [
    //     { name: 'Group 1', tutor: 'Yu Chen', status: GroupStatus.Complete },
    //     { name: 'Group 2', tutor: 'ANNA', status: GroupStatus.Complete },
    //     { name: 'Group 3', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 4', tutor: 'ANNA', status: GroupStatus.NotStarted },
    //     { name: 'Group 5', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 6', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 7', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 8', tutor: 'ANNA', status: GroupStatus.NotStarted },
    //     { name: 'Group 9', tutor: 'Rokecy', status: GroupStatus.NotStarted },
    //     { name: 'Group 10', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 11', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 12', tutor: 'Yu Chen', status: GroupStatus.Pending },
    //     { name: 'Group 13', tutor: 'Rokecy', status: GroupStatus.NeedFeedback },
    //     { name: 'Group 14', tutor: 'Rokecy', status: GroupStatus.NeedFeedback },
    //     { name: 'Group 15', tutor: 'Yu Chen', status: GroupStatus.NotStarted },
    //     { name: 'Group 16', tutor: 'Yu Chen', status: GroupStatus.Pending },
    // ];

    // Fetch groups from the API
    useEffect(() => {
        if (email && courseString && termString) {
            fetchGroups(email, courseString, termString);
        }
    }, [email, courseString, termString]);  // Run effect when these values change
        
    const fetchGroups = async (email: string, course: string, term: string) => {
        try {
            const res = await fetch('/api/staff/returnTeamIssueStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, course, term }),
            });

            if (!res.ok) {
                const errObj = await res.json();
                console.log("teams",errObj)

                throw Error(errObj.error);
            }
            const groupObj = await res.json();
            console.log("groupObj",groupObj)
            setGroups(groupObj.teamSubmissionsRecord);
            console.log("teams",groupObj.teamSubmissionsRecord)
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }

    // Filter groups based on the search term and status filter
    const filteredGroups = groups.filter(group => {
        const matchesTeam = group.team.toLowerCase().includes(searchTerm.toLowerCase());
      
        const matchesMentors = group.mentors.some(mentor => 
          mentor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
        const matchesSearchTerm = matchesTeam || matchesMentors;
      
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
                return 'bg-green-500 text-white border border-green-700';
            case GroupStatus.Pending:
                return 'bg-orange-500 text-white border border-orange-700';
            case GroupStatus.NotStarted:
                return 'bg-gray-500 text-white border border-gray-700';
            case GroupStatus.NeedFeedback:
                return 'bg-blue-500 text-white border border-blue-700';
            default:
                return '';
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Title */}
            <div className="bg-yellow-400 p-6 flex items-center justify-between">
                <div>
                    {/* Back arrow icon */}
                    <button onClick={() => window.history.back()} className="text-black mb-1 flex items-center ">
                        <FaArrowLeft className="mr-2" /> 
                        {'Back'}
                    </button>
                    <h1 className="text-black text-3xl font-bold inline-block ml-2">Groups</h1>
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

            {/* Table */}
            <div className="flex flex-col p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="text-left mt-6">
                        <th className="py-2 px-4 font-bold text-black text-center">Group Name</th>
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
                                    style={{ marginTop: '100px' }}
                                >
        
                                {/* Status options */}
                                {Object.values(GroupStatus).map((status) => (
                                    <div 
                                        key={status} 
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md ${getStatusClass(status)} ${selectedStatus === status ? 'bg-gray-200' : ''}`}
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
                                        setSelectedStatus(''); // Clear the selected status
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
                                <td className="py-3 px-4 text-black text-center">{group.team}</td>
                                <td className="py-3 px-4 text-black text-center">
                                    {group.mentors.join(', ')}
                                </td>
                                <td className="py-3 px-4 flex justify-center items-center">
                                <div className={`flex items-center justify-center ${getStatusClass(group.status)}`} style={{ width: '140px', height: '35px', borderRadius: '8px' }}>
                                        {group.status}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button 
                                        className="bg-black text-white py-1 px-3 rounded-lg"
                                        onClick={() => router.push(`/unifiedInfo?course=${course}&term=${term}&group=${group.team}`)}
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
