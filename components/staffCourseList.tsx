'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Course {
    code: string;
    name: string;
    lecturer: string;
    term: string;
  }

const coursesData: Course[] = [
  { code: 'COMP3900', name: 'Computer science project', lecturer: 'Armin Chitizadeh', term: '22T3' },
  { code: 'COMP3121', name: 'Algorithm', lecturer: 'Anna', term: '24T3' },
  { code: 'COMP9900', name: 'Computer science project', lecturer: 'Armin Chitizadeh', term: '22T3' },
  { code: 'COMP3900', name: 'Computer science project', lecturer: 'Armin Chitizadeh', term: '23T3' },
  { code: 'COMP4920', name: 'Therom', lecturer: 'Jeffery', term: '22T3' },
  { code: 'COMP3311', name: 'SQL', lecturer: 'Wilson', term: '24T1' },
  { code: 'COMP3331', name: 'Web', lecturer: 'Ruiqi', term: '21T3' },
  { code: 'COMP6991', name: 'Rust', lecturer: 'Wilson', term: '24T1' },
  { code: 'MATH1231', name: 'Math1B', lecturer: 'Jeffery', term: '22T2' },
  { code: 'MATH1131', name: 'Math1A', lecturer: 'Rockey', term: '24T0' },
  { code: 'DESN1000', name: 'Design Basic', lecturer: 'Waner', term: '22T3' },
  { code: 'ELEC1111', name: 'Electrical', lecturer: 'Ruiqi', term: '24T3' },
  { code: 'PHYS1121', name: 'Physics', lecturer: 'Guojing', term: '22T3' },
  { code: 'MATH2089', name: 'Math2B', lecturer: 'Someone', term: '24T3' },
  { code: 'COMP1511', name: 'Computer science Basic', lecturer: 'Waner', term: '22T3' },
  { code: 'ENGG1911', name: 'Engineer Python', lecturer: 'Guojing', term: '24T3' },
];

export default function CourseList() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortedCourses, setSortedCourses] = useState<Course[]>([]);

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch('/api/staff/courseList');
//         const data = await response.json();
//         setCoursesData(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//         setIsLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

useEffect(() => {
    const sorted = [...coursesData].sort((a, b) => {
    //     // compare term
    //   if (a.term > b.term) return -1;
    //   if (a.term < b.term) return 1;

      // same term, course code 
      if (a.code < b.code) return -1;
      if (a.code > b.code) return 1;

      return 0;
    });

    setSortedCourses(sorted);
  }, []);

  // searching filter
  const filteredCourses = sortedCourses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                {/* <thead className="bg-gray-200"></thead> */}
        <div className="flex flex-col p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">
        <table className="min-w-full table-fixed">
        <thead className="bg-gray-200 sticky">
            <tr className="text-left">
                <th className="w-1/4 py-2 px-4 font-bold text-black">Course Code</th>
                <th className="w-1/4 py-2 px-4 font-bold text-black">Course Name</th>
                <th className="w-1/4 py-2 px-4 font-bold text-black">Term</th>
                <th className="w-1/4 py-2 px-4 font-bold text-black text-center">Action</th>
            </tr>
            </thead>

            <tbody>
            {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-200">
                    <td className="w-1/4 py-3 px-4 text-black">{course.code}</td>
                    <td className="w-1/4 py-3 px-4 text-black">{course.name}</td>
                    <td className="w-1/4 py-3 px-4 text-black">{course.term}</td>
                    <td className="w-1/4 py-3 px-4 text-center">
                        <button className="bg-black text-white py-1 px-4 rounded-lg">Select</button>
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
