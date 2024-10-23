'use client'
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import ImageKitUpload from './imageKit/ImageKitUpload';


interface FormData {
	teamMembers: string;
	situationExplanation: string;
	fileLink: string;
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
	const [formData, setFormData] = useState<FormData>({
		teamMembers: '',
		situationExplanation: '',
		fileLink: '',
	});

	// Handle input changes for text areas
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleUploadSuccess = (fileUrl: string) => {
		console.log('File uploaded successfully:', fileUrl);
		
		setFormData((prevData) => ({
			...prevData,
            fileLink: fileUrl,
		})
		);
		console.log('File uploaded successfully:', fileUrl);
		
	  };

	// Handle form submission
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const filesUrl = formData.fileLink;

		if (issueId) {
			// Update issue with new data
            const title = 'testing title'
            const content = `Team members ratings: ${formData.teamMembers}.\n situationExplanantions: ${formData.situationExplanation}
            `
			
            try {
                const res = await fetch(`/api/issueSystem/updateIssue/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
						studentId: studentId,
						teamId: teamId,
						courseId: courseId,
						filesUrl: filesUrl,
						title: title,
						content: content,
						issueId: issueId,
                    }),
                });
				if (res.ok) {
					const result = await res.json();
					console.log("Form submitted successfully:", result);
					alert('Success!');
			
				}
				if (!res.ok) {
					//const result = await res.json();
					alert('Error sending the form data. Please try again later.');
				}
				return;

			} catch (error) {
				console.error(error);
                alert('Error updating the issue. Please try again later.');
                return;
			}
		}

		// Log the collected form data
		console.log('Form submitted:', formData);

		// Reset form (optional)
		const title = 'testing title'
		const content = `Team members ratings: ${formData.teamMembers}.\n situationExplanantions: ${formData.situationExplanation}
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
					title: title,
					content: content,
				}),
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Form submitted successfully:", result);
				alert('Success!');
				//router.push('/studentLogout'); 
			}
			if (!res.ok) {
                const errObj = await res.json();
				console.log(errObj.error)
                alert('Error sending the form data. Please try again later.');
			}
		} 
		catch (error) {
			console.error(error);
			alert('Error sending the form data. Please try again later.');
		}
	
	finally {
		setFormData({
			teamMembers: '',
			situationExplanation: '',			fileLink: '',
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
				/>

				<label className="text-lg text-black">3. You can upload your files here.</label>

				<ImageKitUpload
					path={studentId || 'guest'}
					onUploadSuccess={handleUploadSuccess}
					onUploadError={(error) => alert(`Upload error: ${error.message}`)}
				/>
				{formData.fileLink && (
				<a
					href={formData.fileLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 underline"
				>
					View Uploaded File
				</a>
				)}

				<label className="text-lg text-black">
					4. If your file is not supported, please upload them to a server and put the link here.
				</label>
				<textarea
					name="fileLink"
					placeholder="Enter your answer here"
					className="border border-gray-300 text-black p-2 rounded-md h-20"
					value={formData.fileLink}
					onChange={handleChange}
				/>

				<button 
					type="submit" className="bg-black text-white py-2 w-40 rounded-md mx-auto"
					onClick={() => router.push('/studentLogout')}
				>
					Submit
				</button>
			</form>
		</div>
	);
}
