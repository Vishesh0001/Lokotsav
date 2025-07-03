"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import secureFetch from '@/utils/securefetch';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
 
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
const validationSchema = Yup.object().shape({
  event_title: Yup.string().required('Event title is required'),
  start_time: Yup.date().required('Start time is required'),
  end_time: Yup.date()
    .min(Yup.ref('start_time'), 'End time must be after start time')
    .required('End time is required'),
  city: Yup.string().required('City is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  cover_image: Yup.string().required('Cover image URL is required'),
  tips: Yup.string(),
  cultural_significance: Yup.string(),
  location: Yup.string().required('Location is required'),
});

export default function AddEvent() {
  
// const[loading,setloading]=useState(true)
  const formik = useFormik({
    initialValues: {
      event_title: '',
      start_time: '',
      end_time: '',
      city: '',
      category: '',
      description: '',
      cover_image: '',
      tips: '',
      cultural_significance: '',
      location: '',
    },
    validationSchema,
     validateOnMount: true,
validateOnChange: true,
validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      // setloading(false)
      try {
        console.log(values);
        const res = await secureFetch("/create-event", { ...values }, 'POST');
        if (res.code ==1) {
          resetForm();
         toast.success('Event created!')
      // setloading(false)
        } else {
          toast.error(res.message)
          return;
        }
      } catch (error) {
       toast.error(error.message)
        return;
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-accent">Create Event</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="event_title" className="text-deepNavy mb-2">Event Title</Label>
          <Input
            id="event_title"
            name="event_title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.event_title}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.event_title && <p className="text-red-500 mt-2 text-sm">{formik.errors.event_title}</p>}
        </div>

        <div>
          <Label htmlFor="start_time" className="text-deepNavy mb-2">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="datetime-local"
            onChange={formik.handleChange}
            value={formik.values.start_time}
            className="w-50 text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.start_time && <p className="text-red-500 mt-2 text-sm">{formik.errors.start_time}</p>}
        </div>

        <div>
          <Label htmlFor="end_time" className="text-deepNavy mb-2">End Time</Label>
          <Input
            id="end_time"
            name="end_time"
            type="datetime-local"
            onChange={formik.handleChange}
            value={formik.values.end_time}
            className="w-50 text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.end_time && <p className="text-red-500 mt-2 text-sm">{formik.errors.end_time}</p>}
        </div>

        <div>
          <Label htmlFor="city" className="text-deepNavy mb-2">City</Label>
          <select
            id="city"
            name="city"
            onChange={formik.handleChange}
            value={formik.values.city}
            className="w-full p-2 border border-softPink rounded focus:ring-accent bg-base text-gray-500"
          >
            <option value="">Select City</option>
            <option value="vadodra">Vadodra</option>
            <option value="ahemedabad">Ahemedabad</option>
            <option value="gandhinagar">Gandhinagar</option>
            <option value="surat">Surat</option>
            <option value="junagadh">Junagadh</option>
            <option value="rajkot">Rajkot</option>
            <option value="bhavnagar">Bhavnagar</option>
          </select>
          {formik.errors.city && <p className="text-red-500 mt-2 text-sm">{formik.errors.city}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="text-deepNavy mb-2">Category</Label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
            className="w-full p-2 border border-softPink rounded focus:ring-accent bg-base text-gray-500"
          >
            <option value="">Select Category</option>
            <option value="local">Local</option>
            <option value="festival">Festival Event</option>
            <option value="cultural">Cultural Event</option>
            <option value="traditional">Traditional Event</option>
          </select>
          {formik.errors.category && <p className="text-red-500 mt-2 text-sm">{formik.errors.category}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-deepNavy mb-2">Description</Label>
          <Textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full border-softPink focus:ring-accent bg-base text-gray-500"
          />
          {formik.errors.description && <p className="text-red-500 mt-2 text-sm">{formik.errors.description}</p>}
        </div>

        {/* <div>
          <Label htmlFor="cover_image" className="text-accent">Cover Image URL</Label>
          <Input
            id="cover_image"
            name="cover_image"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.cover_image}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.cover_image && <p className="text-red-500 mt-2 text-sm">{formik.errors.cover_image}</p>}
        </div> */}

        <div>
          <Label htmlFor="tips" className="text-deepNavy mb-2">Tips</Label>
          <Textarea
            id="tips"
            name="tips"
            onChange={formik.handleChange}
            value={formik.values.tips}
            className="w-full border-softPink focus:ring-accent bg-base text-gray-500"
          />
          {formik.errors.tips && <p className="text-red-500 mt-2 text-sm">{formik.errors.tips}</p>}
        </div>

        <div>
          <Label htmlFor="cultural_significance" className="text-deepNavy mb-2">Cultural Significance</Label>
          <Textarea
            id="cultural_significance"
            name="cultural_significance"
            onChange={formik.handleChange}
            value={formik.values.cultural_significance}
            className="w-full border-softPink focus:ring-accent bg-base text-gray-500"
          />
          {formik.errors.cultural_significance && <p className="text-red-500 mt-2 text-sm">{formik.errors.cultural_significance}</p>}
        </div>

        <div>
          <Label htmlFor="location" className="text-deepNavy mb-2">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.location}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.location && <p className="text-red-500 mt-2 text-sm">{formik.errors.location}</p>}
        </div>

        
        <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={!formik.isValid || formik.isSubmitting } type="submit" className="w-full bg-accent text-base hover:bg-softPink">
          Submit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Event created successfully</AlertDialogTitle>
          <AlertDialogDescription>
            Your Event would be visible on Lokostav once the admin approves the Event
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href='/user/dashboard'>
           <AlertDialogAction>Go to Personal Dashboard</AlertDialogAction>
           </Link>
           <Link href='/'>
          <AlertDialogAction>Go to Home</AlertDialogAction></Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </form>
    </div>
  );
};