"use client"
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import ImageKitUpload from "./imageKit/ImageKitUpload";
import ImageKitDelete from "./imageKit/ImageKitDelete";
import {deleteImage} from "./services/imageKitApi";


interface FormData {
	teamMembers: string;
	situationExplanation: string;
	fileLinks: { url: string; name: string , id: string}[];
}
interface TeamEvaluationFormProps{
	teamId: string | null;
    courseId: string| null;
    studentId: string| null;
	issueId: string| null;
}

export default function TeamEvaluationForm(props: TeamEvaluationFormProps) {
    // Define state for the form inputs
    const router = useRouter();
    const {teamId, courseId, studentId, issueId} = props;
    //const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        teamMembers: "",
        situationExplanation: "",
        fileLinks: [],
    });

    // Handle input changes for text areas
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUploadSuccess = (fileUrl: string, fileName: string, fileId: string) => {
        console.log("File uploaded successfully:", fileUrl);
        console.log("File Name:", fileName);
        console.log("File Id:", fileId);
        setFormData((prevData) => ({
            ...prevData,
            fileLinks: [...prevData.fileLinks, { url: fileUrl, name: fileName, id: fileId }],
        })
        );
        console.log("File uploaded successfully:", fileUrl);
		
		
	  };


	  const handleDeleteFile = async (index: number, fileId: string) => {
        try {
		  const res = await deleteImage(fileId);
		  if (res) {
                console.log("File deleted successfully:", res);
                alert("File deleted successfully!");
                setFormData((prevData) => ({
                    ...prevData,
                    fileLinks: prevData.fileLinks.filter((file) => file.id !== fileId),
			  }));
                // Perform any additional state updates or UI changes here
		  }
		  else {
                console.error("Failed to delete file:", res);
		  }
        } catch (error) {
		  console.error("Error deleting file:", error);
		  alert("An unexpected error occurred.");
        }
	  };
    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let filesUrl = "";
        let filesName = "";
        for (const file of formData.fileLinks) {
            filesUrl += `${file.url},`;
            filesName += `${file.name},`;
        }
        console.log("File uploaded successfully:", filesUrl);
        if (issueId) {
            // Update issue with new data
            const title = `${formData.teamMembers}`;
            const content = `${formData.situationExplanation}`
			
            try {
                const res = await fetch("/api/issueSystem/updateIssue/", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentId: studentId,
                        teamId: teamId,
                        courseId: courseId,
                        filesUrl: filesUrl,
                        filesName: filesName,
                        title: title,
                        content: content,
                        issueId: issueId,
                    }),
                });
                if (res.ok) {
                    const result = await res.json();
                    console.log("Form submitted successfully:", result);
                    alert("Success!");
			
                }
                if (!res.ok) {
                    //const result = await res.json();
                    alert("Error sending the form data. Please try again later.");
                }
                return;

            } catch (error) {
                console.error(error);
                alert("Error updating the issue. Please try again later.");
                return;
            }
        }

        // Log the collected form data
        console.log("Form submitted:", formData);

        // Reset form (optional)
        const title = `Team members ratings: ${formData.teamMembers}.`;
        const content = `situationExplanantions: ${formData.situationExplanation}
		`
        console.log(studentId)
        try {
            const res = await fetch("/api/issueSystem/createIssue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: studentId,
                    teamId: teamId,
                    courseId: courseId,
                    filesUrl: filesUrl,
                    filesName: filesName,
                    title: title,
                    content: content,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Form submitted successfully:", result);
                alert("Success!");
                router.push("/studentLogout"); 
            }
            if (!res.ok) {
                const errObj = await res.json();
                console.log(errObj.error)
                alert("Error sending the form data. Please try again later.");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error sending the form data. Please try again later.");
        }
	
        finally {
            setFormData({
                teamMembers: "",
                situationExplanation: "",
                fileLinks: [],
            });
		
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Title */}
            <div className="bg-yellow-400 p-9">
                <h1 className="text-black text-3xl font-bold">Team Evaluation Form</h1>
            </div>

            {/* Questions */}
            <form
                className="flex flex-col gap-6 p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md"
                onSubmit={handleSubmit}
            >
                <label className="text-lg text-black">
					1. Please write members of your team and give them a mark between 1 and 10. 1 being the worst case, and 10 being the best case.
                </label>
                <textarea
                    name="teamMembers"
                    placeholder="Enter your answer here"
                    className="border border-gray-300 text-black p-2 rounded-md h-20"
                    value={formData.teamMembers}
                    onChange={handleChange}
                    required
                />

                <label className="text-lg text-black">
					2. Please explain the situation.
                </label>
                <textarea
                    name="situationExplanation"
                    placeholder="Enter your answer here"
                    className="border border-gray-300 text-black p-2 rounded-md h-28"
                    value={formData.situationExplanation}
                    onChange={handleChange}
                    required
                />

                <label className="text-lg text-black">3. You can upload your files here.</label>

      			
                <ImageKitUpload
					
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(error) => alert(`Upload error: ${error.message}`)}
                />

                <div className="mt-4">
                    {formData.fileLinks.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {file.name}
                            </a>
                            <ImageKitDelete
                                fileId = {file.id}
                                index = {index}
                                handleDeleteFile={() => handleDeleteFile(index, file.id)}
                            />
                        </div>
                    ))}
                </div>



                <button 
                    type="submit" className="bg-black text-white py-2 w-40 rounded-md mx-auto"
                >
					Submit
                </button>
            </form>
        </div>
    );
}
