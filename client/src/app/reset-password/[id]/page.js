'use client';

import { decrypt } from '@/utils/crypto';
import secureFetch from '@/utils/securefetch';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  let { id } = useParams();
  id = decrypt(id)
  id = Number(id)
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await secureFetch('/resetpassword',{id, newPassword},'POST')
('qwqwqw',res);

      if (res.code ==1) {
        toast.success('Password reset successfully!');
        router.push('/login'); // redirect to login page
      } else {
        toast.error(res.message.keyword);
      }

    } catch (err) {
      ('ererer',err.message);
      
      toast.error('Something went wrong. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 rounded-xl bg-white shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Reset Your Password</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">Enter your new password below.</p>

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded-md"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full px-4 py-2 border rounded-md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </main>
  );
}
