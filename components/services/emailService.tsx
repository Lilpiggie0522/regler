
export const sendVerificationEmail = async (zID: string, courseCode: string): Promise<Response> => {
  // try {
  const response = await fetch('/api/studentSystem/identityCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ zID: zID, courseCode: courseCode }),
  });
  return response
};

export const sendStaffVerificationEmail = async (email: string): Promise<Response> => {
  // try {
  const response = await fetch('/api/adminSystem/identityCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email }),
  });
  return response
};
