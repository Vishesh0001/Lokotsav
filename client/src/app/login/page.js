"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import secureFetch from "@/utils/securefetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const body = { email: values.email, password: values.password };
        const resposne = await secureFetch("/login", body);
  
        
        if (resposne.code != 1) {
          // throw new Error(data.message?.keyword || "Login failed");
          toast.warning(resposne.message.keyword)
          if(resposne.code == 4){
            router.push('/verify-otp')
          }
        }else{
          ('visheeee',resposne);
          
          const tokenExpiry = new Date(Date.now() + 24* 60 * 60 * 1000); // 5 hour
        Cookies.set("token", resposne.data.token, { expires: tokenExpiry, path: '/' });
        // alert("Login successful");
        toast.success("login successfull")
        if(resposne.data.role=='admin'){router.push('/admin/dashboard')}
       else{
        router.push('/');}
        toast.success('Welcome to Lokotsav!')
      }

      } catch (error) {
        ("error in login page", error.message);
       toast.error(error.message)
        // alert(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto mt-10 bg-base shadow-md border-softPink">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-accent">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-deepNavy mb-3">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-softPink focus:ring-accent text-gray-500 bg-base "
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-deepNavy mb-3">Password</Label>
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
              <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-accent text-base hover:bg-softPink disabled:bg-softPink/50 disabled:text-base/70"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-gray-500 text-center mt-3">Create Account,<Link href='/signup' className="text-blue-500 ml-0.5 underline">Sign-Up</Link></p>
        <p className="text-gray-500 text-center mt-3">Frogot your password?<Link href='/forgot-password' className="text-blue-500 ml-0.5 underline">Reset password</Link></p>
      </CardContent>
    </Card>
  );
}