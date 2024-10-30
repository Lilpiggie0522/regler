'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Student {
    name: string;
    class: string;
    zid: string;
    email: string;
    status: 'Submitted' | 'No Submission';
}

export default function UnifiedInfo() {
    //const [formData, setFormData] = useState<FormData>({
	//});

    // // Handle input changes for text areas
	// const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
	// 	const { name, value } = e.target;
	// 	setFormData((prevData) => ({
	// 		...prevData,
	// 		[name]: value,
	// 	}));
	// };
    const params = useSearchParams()
    const teamId = params.get('teamId')
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [content, setContent] = useState<string>('')
    const [tutorComment, setTutorComment] = useState<string>('')

    // Test student list
    const [students, setStudents] = useState<Student[]>([
        { name: 'Waner Zheng', class: 'H16A', zid: 'z5417505', email: 'z5417505@ad.unsw.edu.au', status: 'Submitted' },
        { name: 'Waner Zheng', class: 'H16A', zid: 'z5417505', email: 'z5417505@ad.unsw.edu.au', status: 'No Submission' },
        { name: 'Waner Zheng', class: 'H16A', zid: 'z5417505', email: 'z5417505@ad.unsw.edu.au', status: 'No Submission' },
        { name: 'Waner Zheng', class: 'H16A', zid: 'z5417505', email: 'z5417505@ad.unsw.edu.au', status: 'Submitted' },
    ]);

    useEffect(() => {
        async function getTutorOpinions() {
            try {
                const response = await fetch(`/api/util/getIssueByTeamId/${teamId}`)
                const comment: string = await response.json()
                if (!response.ok) {
                    console.log(comment)
                } else {
                    setTutorComment(comment)
                }
            } catch {
                throw Error('error fetching comment')
            }
        }
        getTutorOpinions()
    }, [teamId, tutorComment])

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
            const response = await fetch('api/staff/tutorOpinions', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({content: content, teamId: teamId})
            })
            if (!response.ok) {
                console.log(await response.json())
            }
        } catch {
            throw Error('response error, check response')
        }
        // Need to write more
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-yellow-400 p-9 flex justify-between items-center">
                <h1 className="text-black text-3xl font-bold">Group 1</h1>

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

            <div className="max-w-7xl mx-auto p-8 bg-white text-black mt-6 rounded-lg shadow-md">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2">Members</th>
                            <th className="py-2">Class</th>
                            <th className="py-2">ZID</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Status</th>
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
                                <td className={`py-2 ${student.status === 'Submitted' ? 'text-green-500' : 'text-red-500'}`}>
                                    {student.status}
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

                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg text-black">Tutor&apos;s Opinion</label>
                        <p className="border border-gray-300 text-black p-2 rounded-md">
                            {tutorComment}
                        </p>
                        <label className="text-lg text-black">Enter your opinion here</label>
                        <textarea
                            name="yourOpinion"
                            placeholder="Enter your opinion here"
                            className="border border-gray-300 text-black p-2 rounded-md h-20"
					        onChange={(input) => setContent(input.target.value)}
                        />
                        <button type="submit" className="bg-black text-white py-2 w-40 rounded-md mx-auto">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};