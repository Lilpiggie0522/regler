"use client";
import { ChangeEvent, useState } from "react";

interface DisplayData {
    name: string,
    zid: string;
    groupname: string,
    class: string;
    group_id: string;
    group_id2: string;
    mentor: string;
    email: string
}

export default function LecturerPage() {
    const [displayData, setDisplayData] = useState<DisplayData[]>([]);

    const [showData, setShowData] = useState<boolean>(false);

    function cancelFile() {
        const fileInput = document.getElementById("csv") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ""; // Clear the input value???
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file: File | undefined = e.target.files?.[0];
        const formData: FormData = new FormData()
        if (file) {
            formData.append('csv', file)
            sendData(formData)
            alert('form data sent')
        }
    };

    async function sendData(formData: FormData) {
        // console.log(results.data)
        try {
            const response = await fetch('api/staff/readCsv', {
                method: 'POST',
                body: formData
            })
            if (response.ok) {
                alert("OK! Data sent and received")
                const displayData = await response.json()
                console.log(displayData)
                setShowData(true)
                setDisplayData(displayData)
            } else {
                const error = await response.json()
                alert(error.message)
            }
        } catch (error) {
            console.log(error)
            alert("oh no!")
        }

    }

    return (
        <div>
            <div className="flex justify-center">
                <h1 className="text-5xl">Just the main</h1>
            </div>
            <br />
            <div className="flex justify-center">
                <h1 className="text-5xl">upload a csv here</h1>
            </div>
            <div className="flex justify-center mt-3">
                <input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
                <button className="bg-gray-500" type="button" onClick={cancelFile}>Cancel</button>
            </div>
            <div className="flex justify-center mt-3">
                {showData &&
                    <table>
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">name</th>
                                <th className="border border-gray-300 p-2">zid</th>
                                <th className="border border-gray-300 p-2">class</th>
                                <th className="border border-gray-300 p-2">groupName</th>
                                <th className="border border-gray-300 p-2">group Id</th>
                                <th className="border border-gray-300 p-2">group Id2</th>
                                <th className="border border-gray-300 p-2">mentor</th>
                                <th className="border border-gray-300 p-2">email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((row, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{row.name}</td>
                                    <td className="border border-gray-300 p-2">{row.zid}</td>
                                    <td className="border border-gray-300 p-2">{row.class}</td>
                                    <td className="border border-gray-300 p-2">{row.groupname}</td>
                                    <td className="border border-gray-300 p-2">{row.group_id}</td>
                                    <td className="border border-gray-300 p-2">{row.group_id2}</td>
                                    <td className="border border-gray-300 p-2">{row.mentor}</td>
                                    <td className="border border-gray-300 p-2">{row.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
            </div>
        </div>
    )
}