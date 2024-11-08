// components/LoadingSpinner.tsx
"use client";

import React from "react";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3; /* Light grey */
                    border-top: 8px solid #ffcc02; /* Yellow */
                    border-radius: 50%;
                    width: 60px; /* Adjust size */
                    height: 60px; /* Adjust size */
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
