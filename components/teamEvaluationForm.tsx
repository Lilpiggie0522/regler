export default function TeamEvaluationForm() {
	return (
		<div className="min-h-screen bg-gray-100">
		{/* Title */}
			<div className="bg-yellow-400 p-9">
				<h1 className="text-black text-3xl font-bold">
					Team Evaluation Form
				</h1>
			</div>

			{/* Questions */}
			<div className="flex flex-col gap-6 p-8 mt-6 bg-white max-w-7xl mx-auto rounded-lg shadow-md">

				<label className="text-lg text-black">
					1. Please write members of your team and give them a mark between 1 and 10. 1 being the worst case, and 10 being the best case.
				</label>
				<textarea
					placeholder="Enter your answer here"
					className="border border-gray-300 text-black p-2 rounded-md h-20"
				/>

				<label className="text-lg text-black">
						2. Please explain the situation.
				</label>
				<textarea
					placeholder="Enter your answer here"
					className="border border-gray-300 text-black p-2 rounded-md h-28"
				/>

				<label className="text-lg text-black">
						3. You can upload your files here.
				</label>
				<input
					type="file"
					className="border border-gray-300 text-black p-2 rounded-md"
				/>

				<label className="text-lg text-black">
					4. If your file is not supported, please upload them to a server and put the link here.
				</label>
				<textarea
					placeholder="Enter your answer here"
					className="border border-gray-300 text-black p-2 rounded-md h-20"
				/>

				<button className="bg-black text-white py-2 w-40 rounded-md mx-auto" //onSubmit={()=>{}}
					>
					Submit
				</button>
				
			</div>
		</div>
	)
}