
export const sendVerificationEmail = async (zID: string, courseCode: string): Promise<Response> => {
    // try {
      const response = await fetch('/api/studentSystem/identityCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zid: zID, courseCode: courseCode }),
      });

      // if (!response.ok) {
      //   console.error('Failed to send verification email.');
      //   return false;
      // }
      // console.log('Verification email sent successfully.');
      // return true;
      return response
  };
  