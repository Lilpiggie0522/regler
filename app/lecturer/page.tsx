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
    const [showWindow, setShowWindow] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
    const [uploading, setUploading] = useState<boolean>(false)
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
        setUploading(false)
    }

    return (
        <div>
            <div className="bg-yellow-400 h-20 p-5 flex justify-between items-center">
                <h1 className="text-black text-3xl font-bold">Dashboard</h1>
                <button className="bg-black text-white rounded-full w-32 min-h-10" onClick={handleShowWindow}>Read CSV</button>
            </div>
            {showWindow && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-100 min-h-[60vh] min-w-[50vw] relative flex flex-col items-cente justify-center"> 
                    <button className="absolute top-2 right-2 text-black text-3xl" onClick={handleCloseWindow}>
                        &times;
                    </button>
                    <div className="flex flex-col justify-center items-center rounded-lg">
                        <div className="flex p-5">
                            <input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
                            <button className="bg-gray-300 rounded-lg p-1" type="button" onClick={cancelFile}>Cancel</button>
                        </div>
                        <div>
                            {uploading && <p>Uploading file, please wait</p>}
                            <button className="bg-green-400 rounded-lg p-1" type="button" onClick={handleSubmit}>Submit</button>
                        </div>
                        <div className="flex justify-center p-5">
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

                </div>
            </div>}
        </div>
    )
}