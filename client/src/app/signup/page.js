"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import secureFetch from '@/utils/securefetch';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
//         const res = await fetch('/api/auth/signup', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ...values }),
//         });
// console.log("response",res)
//         if (res.status!=200) {
//           const data = await res.json();
//           console.log("full data",data)
//           console.log(data.message)
//           // alert(`${data.message}`)
//           throw new Error(data.message.keyword || 'Signup failed');
        
       const resposne = await secureFetch('/signup',{...values},'POST')
       if(resposne.code!=1){
        alert(`${resposne.message.keyword}`)
        
}else{
         alert("signup successfull")
        router.push('/login');}
      } catch (err) {
        alert(`${err.message}`)
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-md">

    
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              formik.touched.username && formik.errors.username
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
          )}
        </div>

       
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              formik.touched.phone && formik.errors.phone
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
          )}
        </div>

        
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        
        <div>
          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              formik.touched.confirmpassword && formik.errors.confirmpassword
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.confirmpassword && formik.errors.confirmpassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>
          )}
        </div>

       
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 rounded-md bg-green-500 text-white
          font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
          {loading ? 'Signing up...' : 'Signup'}
        </button>
   
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
