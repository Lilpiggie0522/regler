// import Image from "next/image";
'use client';

import React from "react";
import { useState } from "react";


export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const sendEmail = async () => {
        setLoading(true);
        try {
            // Sample Input
            // team id, course id, student id (student who submits the application)
            const input = {
                teamId: "6700eaee7ae942fe983415c8",
                courseId: "6701f96d84f93badca934c10",
                studentId: "670222deb7b79c45884600d7"
            }
            const res = await fetch('/api/mailingSystem/sendTeam', {method: 'POST', body: JSON.stringify(input)});
            if (res.ok) {
                setResult(`Email has sent to team members`);
            } else {
                const data = await res.json();
                setResult(`Error: ${data.error}, status: ${data.status}`);
            }
        } catch (error) {
            setResult(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testAuthCode = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/mailingSystem/testAuthCode', {method: 'POST'});
            if (res.ok) {
                setResult(`Verification email sent successfully.`);
            } else {
                const data = await res.json();
                setResult(`Error: ${data.error}, status: ${data.status}`);
            }
        } catch (error) {
            setResult(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={sendEmail} disabled={loading}>
                test - send email
            </button>
            <button onClick={testAuthCode} disabled={loading}>
                test - send verification code
            </button>
            <p>{result}</p>
        </div>
        
    );
}