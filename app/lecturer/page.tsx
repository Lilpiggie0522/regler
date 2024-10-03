"use client";
import { ChangeEvent, useState } from "react";
import Papa, { ParseResult } from "papaparse";

export default function main() {
    const [displayData, setDisplayData] = useState<any[]>([]);

    const [showData, setShowData] = useState<Boolean>(false);

    function cancelFile() {
        const fileInput = document.getElementById("csv") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ""; // Clear the input value???
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file: File | undefined = e.target.files?.[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(results)
                    sendDataToBackend(results);
                },
            })
        }
    };

    async function sendDataToBackend(results: ParseResult<unknown>) {
        // console.log(results.data)
        try {
            const response = await fetch('api/readCSV', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(results.data)
            })
            if (response.ok) {
                alert("OK! Data sent and received")
                const displayData = await response.json()
                console.log(displayData.data)
                setShowData(true)
                setDisplayData(displayData.data)
            } else {
                throw new Error("network response not ok!")
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
                                <th className="border border-gray-300 p-2">year</th>
                                <th className="border border-gray-300 p-2">name</th>
                                <th className="border border-gray-300 p-2">percent</th>
                                <th className="border border-gray-300 p-2">sex</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((row, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{row.year}</td>
                                    <td className="border border-gray-300 p-2">{row.name}</td>
                                    <td className="border border-gray-300 p-2">{row.percent}</td>
                                    <td className="border border-gray-300 p-2">{row.sex}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
            </div>
        </div>
    )
}