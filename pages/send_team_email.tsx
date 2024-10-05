// import Image from "next/image";
'use client';

import React from "react";
import { useState } from "react";


export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const sendEmail = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/mailingSystem/sendTeam', {method: 'POST', body: JSON.stringify({teamId: 1, teamName: 'Arcaea'})});
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