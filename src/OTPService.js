const API_BASE_URL = 'http://localhost:3002/api';

export const sendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data;
      } catch {
        return { success: false, message: `Server error: ${response.status}` };
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Cannot connect to server. Make sure API is running on port 3001.' };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data;
      } catch {
        return { success: false, message: `Server error: ${response.status}` };
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: 'Cannot connect to server. Make sure API is running on port 3001.' };
  }
};
