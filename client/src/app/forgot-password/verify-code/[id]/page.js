'use client';

import { decrypt, encrypt } from '@/utils/crypto';
import secureFetch from '@/utils/securefetch';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VerifyCodePage() {
  const router = useRouter();
  let { id } = useParams();
  id = decrypt(id)
  ('dsxcxccx',id);
  let encyotedid = encrypt(String(id))
  ('enssss',encyotedid);
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateCode = (input) => /^[A-Z0-9]{8}$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCode(code)) {
      toast.error("Code must be 8 characters long, using capital letters and digits only.");
      return;
    }

    setLoading(true);
    try {
      let response = await secureFetch('/verifycode',{id,code},'POST')
          if(response.code==1){
            toast.success('verification successful!')
            let encid = encrypt(id)
            router.push(`/reset-password/${encyotedid}`)
          }

    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 rounded-xl bg-white shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Your Code</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter the 8-digit verification code sent to your email.
        <br />
        <span className="text-xs italic text-gray-400">Check spam or promotional folder if not found.</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          maxLength={8}
          className="w-full px-4 py-2 border rounded-md uppercase tracking-widest text-center text-lg"
          placeholder="Enter CODE"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </main>
  );
}
