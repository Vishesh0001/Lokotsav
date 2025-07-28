'use client';

import { useState,useEffect } from 'react';
import { useRouter ,useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { encrypt } from '@/utils/crypto';
const RESEND_TIMEOUT = 150; // 2.5 minutes in seconds
const MAX_RESEND_ATTEMPTS = 3;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
  const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  const encryptedApiKey =encrypt(apiKey)
export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
    const { id } = useParams();
  // const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(90);
  const [resendAttempts, setResendAttempts] = useState(0);
  const router = useRouter();

    useEffect(() => {
    if (resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
toast.warning('Enter OTP of 6 digits')
      return;
    }

    // setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${BaseURL}/v1/user/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "api-key": encryptedApiKey,
        },
        body: JSON.stringify({ otp }),
      });

      const result = await res.json();

      if (result.code ==1) {
                 const tokenExpiry = new Date(Date.now() +  24*60 * 60 * 1000); // 5mins   hour
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
 const handleResendOtp = async () => {
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      toast.warning('Maximum resend attempts reached');
      return;
    }
        setResendLoading(true);
           try {
      const res = await fetch(`${BaseURL}/v1/user/resendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "api-key": encryptedApiKey,
        },
        body: JSON.stringify({id}), 
      });

      const result = await res.json();
// ('ressss',result

// );

      if (result.code == 1) {
        toast.success('OTP resent successfully');
        setResendAttempts((prev) => prev + 1);
        setResendTimer(RESEND_TIMEOUT);
      } else {
        toast.error(result.message.keyword || 'Could not resend OTP');
      }
    } catch (error) {
      toast.error('Something went wrong while resending OTP');
  
    } finally {
      setResendLoading(false);
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

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="secondary"
          onClick={handleResendOtp}
          disabled={
            resendLoading ||
            resendTimer > 0 ||
            resendAttempts >= MAX_RESEND_ATTEMPTS
          }
        >
          {resendLoading
            ? 'Sending...'
            : resendAttempts >= MAX_RESEND_ATTEMPTS
            ? 'Max Resends Reached'
            : resendTimer > 0
            ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')}`
            : 'Resend OTP'}
        </Button>

        <p className="text-sm text-muted-foreground mt-1">
          Attempts left: {MAX_RESEND_ATTEMPTS - resendAttempts}
        </p>
        <strong className='text-center text-red-500'>Also check your spam folder for OTP</strong>
      </div>
    </div>
  );

}
