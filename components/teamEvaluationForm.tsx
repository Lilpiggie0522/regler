'use client'
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import ImageKitUpload from './imageKit/ImageKitUpload';
import ImageKitDelete from './imageKit/ImageKitDelete';
import {deleteImage} from './services/imageKitApi';
import {useEffect} from 'react';


interface FormData {
	fileLinks: { url: string; name: string , id: string}[];
	answers: string[]; // Initialize as empty array
}
interface TeamEvaluationFormProps{
	teamId: string | null;
    courseId: string| null;
    studentId: string| null;
	issueId: string| null;
}
interface Question {
	question: string;
}

export default function TeamEvaluationForm(props: TeamEvaluationFormProps) {
	// Define state for the form inputs
	const router = useRouter();
	const { teamId, courseId, studentId, issueId } = props;
	const [formData, setFormData] = useState<FormData>({
		fileLinks: [],
		answers: [], // Initialize as empty array
	});
	const [questions, setQuestions] = useState<string[]>([]);

	const fetchQuestions = async(courseId : string | null) => {
		// Fetch questions from your API endpoint or database based on the provided teamId, courseId, and studentId
        // Replace the following code with your actual API call or database query
		if (questions.length > 0) {
			return; // Return early if questions are already fetched and available
		}
        const questionsData = await fetch(`/api/util/getCourseById/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => data.questions);
		console.log('Fetched questions:', questionsData);
		setQuestions((prevQuestions) => {
			const newQuestions = [...prevQuestions];
			questionsData.forEach((row : Question, index: number) => {
				newQuestions[index] = row.question; // Set question by index
			});
			return newQuestions;
		});
	};
    useEffect(() => {
        
        fetchQuestions(courseId);
    }, [courseId]);

	// Handle input changes for text areas
	const handleAnswerChange = (index: number, value: string) => {
		setFormData(prevData => {
			const updatedAnswers = [...prevData.answers];
			updatedAnswers[index] = value;
			return { ...prevData, answers: updatedAnswers };
		});
	};

	const handleUploadSuccess = (fileUrl: string, fileName: string, fileId: string) => {
		console.log('File uploaded successfully:', fileUrl);
		console.log('File Name:', fileName);
		console.log('File Id:', fileId);
		setFormData((prevData) => ({
			...prevData,
            fileLinks: [...prevData.fileLinks, { url: fileUrl, name: fileName, id: fileId }],
		})
		);
		console.log('File uploaded successfully:', fileUrl);
		
		
	  };


	  const handleDeleteFile = async (index: number, fileId: string) => {

		try {
		  const res = await deleteImage(fileId);
		  if (res) {
			console.log('File deleted successfully:', res);
			alert('File deleted successfully!');
			setFormData((prevData) => ({
				...prevData,
				fileLinks: prevData.fileLinks.filter((file) => file.id !== fileId),
			  }));
			// Perform any additional state updates or UI changes here
		  }
		  else {
			console.error('Failed to delete file:', res);
		  }
		} catch (error) {
		  console.error('Error deleting file:', error);
		  alert('An unexpected error occurred.');
		}
	  };
	// Handle form submission
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let filesUrl = '';
		let filesName = '';
		for (const file of formData.fileLinks) {
			filesUrl += `${file.url},`;
			filesName += `${file.name},`;
		}
		console.log('questions:' + questions);
		console.log('answers: ' + formData.answers);
		console.log('File uploaded successfully:', filesUrl);
		if (issueId) {
			// Update issue with new data
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
						filesName: filesName,
						questions: questions,
						answers: formData.answers,
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
					questions: questions,
					answers: formData.answers,
				}),
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Form submitted successfully:", result);
				alert('Success!');
				router.push('/studentLogout'); 
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
			fileLinks: [],
			answers: Array(questions.length).fill('')
		});
		
	}
	};

	return (
		<div className="min-h-screen bg-gray-100">
		<div className="bg-yellow-400 p-9">
			<h1 className="text-black text-3xl font-bold">Team Evaluation Form</h1>
		</div>
		<form className="flex flex-col gap-6 p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md" onSubmit={handleSubmit}>
			{questions.map((question, index) => (
				<div key={index}>
					<div className="question-row" key={index}>
						<label className="text-lg text-black block">{`${index + 1}. ${question}`}</label>
						<textarea
							placeholder="Enter your answer here"
							className="border border-gray-300 text-black p-2 rounded-md w-full h-20"
							value={formData.answers[index]}
							onChange={e => handleAnswerChange(index, e.target.value)}
							required
						/>
					</div>

				</div>
			))}

			<label className="text-lg text-black">3. You can upload your files here.</label>
			<ImageKitUpload onUploadSuccess={handleUploadSuccess} onUploadError={error => alert(`Upload error: ${error.message}`)} />

			<div className="mt-4">
				{formData.fileLinks.map((file, index) => (
					<div key={index} className="flex items-center justify-between border-b py-2">
						<a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
							{file.name}
						</a>
						<ImageKitDelete fileId={file.id} index={index} handleDeleteFile={() => handleDeleteFile(index, file.id)} />
					</div>
				))}
			</div>

			<button type="submit" className="bg-black text-white py-2 w-40 rounded-md mx-auto">Submit</button>
		</form>
	</div>
	);
}
