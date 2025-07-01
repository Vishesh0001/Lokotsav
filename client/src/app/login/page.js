
"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'
import secureFetch from "@/utils/securefetch";
export default function Login() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState("email");

  const formik = useFormik({
    initialValues: { email: "", phone: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().when("loginMethod", {
        is: () => loginMethod === "email",
        then: (schema) => schema.email("Invalid email").required("Email is required"),
      }),
      phone: Yup.string().when("loginMethod", {
        is: () => loginMethod === "phone",
        then: (schema) =>
          schema.matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
      }),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const body =
          loginMethod === "email"
            ? { email: values.email, password: values.password }
            : { phone: values.phone, password: values.password };

        const data = await secureFetch("/login",body)
        if(data.code!=1){
          throw new Error(data.message?.keyword || "Login failed")
        }
        // console.log("ndata",data.data.role)
        // if (res.status !== 200) {
        //   throw new Error(data.message?.keyword || "Login failed");
        // }
        Cookies.set("token", data.data.token, { expires: 1, path: '/' });
        alert("Login successful");
        // router.push(data.data.role == "admin" ? "/admin/dashboard" : "/user/dashboard");
        router.push('/')
      } catch (error) {
        console.log("error in login page",error.message)
        alert(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <div className="mb-4 flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="loginMethod"
            value="email"
            checked={loginMethod === "email"}
            onChange={() => setLoginMethod("email")}
            className="mr-1"
          />
          Email
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="loginMethod"
            value="phone"
            checked={loginMethod === "phone"}
            onChange={() => setLoginMethod("phone")}
            className="mr-1"
          />
          Phone
        </label>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {loginMethod === "email" && (
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
        )}

        {loginMethod === "phone" && (
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded"
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            )}
          </div>
        )}

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}