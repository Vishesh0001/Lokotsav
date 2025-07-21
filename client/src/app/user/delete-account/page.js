'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import secureFetch from '@/utils/securefetch';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
export default function DeleteAccountForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const router = useRouter();
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await secureFetch('/deleteaccount',{email,password},'POST')
      if (result.code==1) {
        toast.success('Your account has been deleted');
         Cookies.remove('token', { path: '/' });
      router.push('/')
      } else {
        toast.error(result.message.keyword || 'Could not delete account');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDelete} className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
      <Input
        type="email"
             className='bg-gray-400'
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        className='bg-gray-400'
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button
        type="submit"
        className="w-full bg-red-600 text-white hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Account'}
      </Button>
      <p className="text-sm text-gray-500">
        This action is <span className="font-bold text-red-500">irreversible</span>. Please confirm your email and password to permanently delete your account.
      </p>
    </form>
  );
}
