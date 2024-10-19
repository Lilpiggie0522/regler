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
    mentor_email:string;
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
                alert("OK! Data sent and received")
                const displayData = await response.json()
                console.log(displayData)
                setShowData(true)
                setDisplayData(displayData)
            } else {
                const error = await response.json()
                alert(error)
            }
        } catch (error) {
            console.log(error)
            alert("oh no!")
        }
        setUploading(false)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-yellow-400 h-20 p-5 flex justify-between items-center">
                <h1 className="text-black text-3xl font-bold">Dashboard</h1>
                <button className="bg-black text-white rounded-full w-32 min-h-10" onClick={handleShowWindow}>Import CSV</button>
            </div>

            {showWindow && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-100 min-h-[40vh] min-w-[40vw] rounded-lg relative flex flex-col items-center justify-center">
                        <button className="absolute top-2 right-3 text-black text-3xl" onClick={handleCloseWindow}>
                            &times;
                        </button>
                        <div className="flex flex-col justify-center items-center rounded-lg">
                            <div className="flex p-5 text-black">
                                <input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
                            </div>

                            <div className="flex space-x-4">
                                <button className="bg-gray-300 text-black rounded-lg p-1" type="button" onClick={cancelFile}>Cancel</button>
                                <button className="bg-black text-white rounded-lg p-1" type="button" onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className="flex space-x-4">
                                {uploading && <p className="text-black">Uploading file, please wait</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-100 max-h-[700px] w-[90vw] rounded-lg relative flex flex-col items-center justify-center">
                        <button className="absolute top-2 right-3 text-black text-3xl" onClick={handleCloseData}>
                            &times;
                        </button>
                        <div className="p-5 text-black w-full overflow-y-scroll">
                            <p className="mb-4 text-lg font-bold text-center">
                            Your CSV file has been successfully imported:
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
        </div>
    )                  
}