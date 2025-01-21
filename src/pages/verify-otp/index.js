// pages/verify-otp.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase/config';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';

const VerifyOTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    setLoading(true);

    try {
      // Retrieve verification ID and form data from session storage
      const verificationId = JSON.parse(window.sessionStorage.getItem('verificationId'));
      const sellFormData = JSON.parse(window.sessionStorage.getItem('sellFormData'));

      if (!verificationId || !otp) {
        alert('Invalid verification data or OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Create a credential with the verification ID and OTP
      const credential = PhoneAuthProvider.credential(verificationId.verificationId, otp);

      // Sign in using the credential
      await signInWithCredential(auth, credential);

      // Submit the form data to your backend
      const response = await fetch('/api/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellFormData),
      });

      if (response.ok) {
        alert('OTP verified and form submitted successfully!');
        router.push('/success'); // Redirect to a success page
      } else {
        const errorData = await response.json();
        alert(`Error submitting form: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className={`w-full p-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
