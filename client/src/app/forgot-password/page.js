'use client'
import { encrypt } from '@/utils/crypto';
import secureFetch from '@/utils/securefetch';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');


  const [loading, setLoading] = useState(false);
const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    


    if (!email) {
      toast.error('Enter your registered email address')
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
let response = await secureFetch('/forgotpassword',{email},'POST')
 (response);
 if(response.code==1){
let user_id  = response.data
let encuid = encrypt(String(user_id))
router.push(`/forgot-password/verify-code/${encuid}`)
toast.success(response.message.keyword)
}else{
    toast.error(response.message.keyword)
    return;
}

   

      setEmail('');
    } catch (err) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-center mb-5">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
          autoFocus
        />
   

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : 'Send Verification Link'}
        </button>
      </form>
    </div>
  );
}
