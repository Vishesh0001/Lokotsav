"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import secureFetch from '@/utils/securefetch';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),

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
   
      email: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await secureFetch('/signup', { ...values }, 'POST');
        if (response.code != 1) {
          toast.warning(response.message.keyword)
      
        } else {
       toast.success("sign-up successfull!")
          router.push('/verify-otp');
           toast('OTP sent to entered Email')
        }
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false);
       
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto mt-12 bg-base shadow-md border-softPink">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-accent">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-deepNavy mb-2">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-softPink focus:ring-accent text-gray-600 bg-base"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
            )}
          </div>



          <div>
            <Label htmlFor="email" className="text-deepNavy mb-2">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-softPink focus:ring-accent text-gray-600 bg-base"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-deepNavy mb-2">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-softPink focus:ring-accent text-gray-600 bg-base"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmpassword" className="text-deepNavy mb-2">Confirm Password</Label>
            <Input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              placeholder="Confirm your password"
              value={formik.values.confirmpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-softPink focus:ring-accent text-gray-600 bg-base"
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-base hover:bg-softPink disabled:bg-softPink/50 disabled:text-base/70"
          >
            {loading ? 'Signing up...' : 'Sign-up'}

          </Button>

          <p className="text-center text-sm text-accent">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}