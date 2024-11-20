/** @type {import("next").NextConfig} */
const nextConfig = {}

// js fetch to node fetch
import fetch from "node-fetch"

// Potentially ensure initialisation only execute once.
// Could execute twice in development phase due to HMR
let executed = false

async function InitialiseReminder() {
  if (executed) {
    return
  }
  executed = true
   
  // Wait for 3 seconds for server to completely loaded
  // Could introduce ECONNREFUSED error in build phase since make request before server is ready
  // But no error occurs and works in both develop and production phase.
  await new Promise(resolve => setTimeout(resolve, 3000))

  try {
    await fetch("http://localhost:3000/api/mailingSystem/setReminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return "Reminder Initialised"
  } catch (error) {
    return `Unexpected error ${error}`
  }
}

InitialiseReminder() // Trigger the HTTP request outside the Webpack config


export default nextConfig
