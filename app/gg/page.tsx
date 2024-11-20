// "use client"
// import { useState } from "react"

// export default function GGPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const openModal = () => setIsModalOpen(true)
//   const closeModal = () => setIsModalOpen(false)

//   return (
//     <div className="flex min-h-screen flex-col items-center p-5">
//       <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Open Upload Modal
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Upload Files and Information</h2>

//             <form action="">
//               <input type="file" className="mb-4" />

//               <input
//                 type="text"
//                 placeholder="Name"
//                 className="w-full p-2 mb-4 border border-gray-300 rounded"
//               />

//               <select
//                 className="w-full p-2 mb-4 border border-gray-300 rounded"
//               >
//                 <option value="">Select Age</option>
//                 <option value="1">1</option>
//                 <option value="2">2</option>
//                 <option value="3">3</option>
//               </select>

//               <div className="flex justify-center">
//                 <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
//                   Close
//                 </button>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"
import React, { useState } from 'react';

export default function GGPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to handle form submission, such as sending data to a server
    console.log('Form submitted');
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Modal
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="age" className="block text-gray-700">
                  Age:
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="file" className="block text-gray-700">
                  Upload File:
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4 mr-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}