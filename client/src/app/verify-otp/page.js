'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  // const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
toast.warning('Enter OTP of 6 digits')
      return;
    }

    // setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/v1/user/verifyotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const result = await res.json();

      if (result.code ==1) {
                 const tokenExpiry = new Date(Date.now() +  5 * 60 * 1000); // 5mins   hour
               Cookies.set("token", result.data.token, { expires: tokenExpiry, path: '/' });
               toast.success('verification completed')
        router.push('/');
        toast('welcome to Lokotsav')
      } else {
        toast.error('Invalid OTP. Please try again.')
        // setErrorMsg('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('something went wrong')
      // setErrorMsg('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {/* {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>} */}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
    </div>
  );
}
