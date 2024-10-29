'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useStudentContext } from '@/context/studentContext';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    course: string;
    term: string;
  }

// const coursesData: Course[] = [
//   { code: 'COMP3900', term: '22T3' },
//   { code: 'COMP3121', term: '24T3' },
//   { code: 'COMP9900', term: '22T3' },
//   { code: 'COMP3900', term: '23T3' },
//   { code: 'COMP4920', term: '22T3' },
//   { code: 'COMP3311', term: '24T1' },
//   { code: 'COMP3331', term: '21T3' },
//   { code: 'COMP6991', term: '24T1' },
//   { code: 'MATH1231', term: '22T2' },
//   { code: 'MATH1131', term: '24T0' },
//   { code: 'DESN1000', term: '22T3' },
//   { code: 'ELEC1111', term: '24T3' },
//   { code: 'PHYS1121', term: '22T3' },
//   { code: 'MATH2089', term: '24T3' },
//   { code: 'COMP1511', term: '22T3' },
//   { code: 'ENGG1911', term: '24T3' },
// ];

export default function CourseList() {
    const router = useRouter();
    
    const { useLocalStorageState } = useStudentContext();
    const [email,] = useLocalStorageState('email', '');
    // const [role,] = useLocalStorageState('role', '');
    // const [, setCourseId] = useLocalStorageState('courseId', '');

    console.log("email:", email);
    // console.log("role:", role);
    
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortedCourses, setSortedCourses] = useState<Course[]>([]);
    const [coursesData, setCoursesData] = useState<Course[]>([]);

    useEffect(() => {
        if (email) {
            fetchCourses(email);
            }
        }, [email]);  // Run effect when these values change
        
        const fetchCourses = async (email: string) => {
            try {
                // console.log('Sending email:', email);

                const coursesResponse = await fetch('/api/staff/courseList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                // console.log('Response Status:', coursesResponse.status);

                if (!coursesResponse.ok) {
                    const errObj = await coursesResponse.json();
                    // console.log('Error Response:', errObj);
                    throw Error(errObj.error);
                }
                const courseObj = await coursesResponse.json();
                console.log('Fetched Courses:', courseObj.courses);

                setCoursesData(courseObj.courses);
                console.log('Courses!!!!!!',courseObj.courses)
            } catch (error) {
                // console.error('Error fetching courses:', error);
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
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Title */}
            <div className="bg-yellow-400 p-9 flex justify-between items-center">
                <h1 className="text-black text-3xl font-bold">Courses</h1>
            
                {/* Search bar section */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* Font Awesome Search Icon */}
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
                        <td className="w-1/3 py-3 px-4 text-black text-center">{course.term}</td>
                        <td className="w-1/3 py-3 px-4 text-center">
                            <button 
                                className="bg-black text-white py-1 px-4 rounded-lg"
                                onClick={() => router.push(`/staffGroupList`)}
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
