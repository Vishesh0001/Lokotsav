"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import secureFetch from '@/utils/securefetch';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const validationSchema = Yup.object().shape({
  event_title: Yup.string().required('Event title is required'),
  start_time: Yup.date().required('Start time is required'),
  end_time: Yup.date()
    .min(Yup.ref('start_time'), 'End time must be after start time')
    .required('End time is required'),
  city: Yup.string().required('City is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),

  tips: Yup.string(),
  cultural_significance: Yup.string(),
  location: Yup.string().required('Location is required'),
   total_tickets: Yup.number().required('total event ticket is required').min(0).max(1000),
    tickets_left: Yup.number()
    .required('Available tickets for events is required')
    .min(10, 'Minimum 10 tickets')
    .max(Yup.ref('total_tickets'), 'Available tickets cannot be greater than total tickets'),
   ticket_price:Yup.number().required('ticket price is required').min(10).max(2000)
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
      tips: '',
      cultural_significance: '',
      location: '',
        total_tickets:'',
      tickets_left:'',
      ticket_price:'',
    },
    validationSchema,
  


    onSubmit: async (values, { resetForm }) => {
      // setloading(false)
      try {
        console.log(values);
        const res = await secureFetch("/create-event", { ...values }, 'POST',true);
        if (res.code ==1) {
          resetForm();
         toast.success('Event created!')
      
        } else {
          toast.error(res.message.keyword)
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
    <option value="ahmedabad">Ahmedabad</option>
    <option value="amreli">Amreli</option>
    <option value="anand">Anand</option>
    <option value="bharuch">Bharuch</option>
    <option value="bhavnagar">Bhavnagar</option>
    <option value="dahod">Dahod</option>
    <option value="gandhinagar">Gandhinagar</option>
    <option value="jamnagar">Jamnagar</option>
    <option value="junagadh">Junagadh</option>
    <option value="mehsana">Mehsana</option>
    <option value="morbi">Morbi</option>
    <option value="nadiad">Nadiad</option>
    <option value="navsari">Navsari</option>
    <option value="porbandar">Porbandar</option>
    <option value="rajkot">Rajkot</option>
    <option value="surat">Surat</option>
    <option value="surendranagar">Surendranagar</option>
    <option value="vadodara">Vadodara</option>
    <option value="valsad">Valsad</option>
    <option value="veraval">Veraval</option>
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
         <option value="Local Events">Local Events</option>
<option value="Cultural Festivals">Cultural Festivals</option>
<option value="Religious Festivals">Religious Festivals</option>
<option value="Dance & Music">Dance & Music</option>
<option value="Art & Craft">Art & Craft</option>
<option value="Food & Culinary">Food & Culinary</option>
<option value="Business & Networking">Business & Networking</option>
<option value="Comedy Shows">Comedy Shows</option>
<option value="Workshops & Performances">Workshops & Performances</option>
<option value="Conferences & Exhibitions">Conferences & Exhibitions</option>
<option value="Hobbies">Hobbies</option>
<option value="Nightlife">Nightlife</option>

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

  <div>
          <Label htmlFor="total_tickets" className="text-deepNavy mb-2">Event capacity</Label>
          <Input
            id="total_tickets"
            name="total_tickets"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.total_tickets}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.total_tickets && <p className="text-red-500 mt-2 text-sm">{formik.errors.total_tickets}</p>}
        </div>
             <div>
          <Label htmlFor="tickets_left" className="text-deepNavy mb-2">Slots left</Label>
          <Input
            id="tickets_left"
            name="tickets_left"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.tickets_left}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.tickets_left && <p className="text-red-500 mt-2 text-sm">{formik.errors.tickets_left}</p>}
        </div>
             <div>
          <Label htmlFor="ticket_price" className="text-deepNavy mb-2">Ticket price(In INR)</Label>
          <Input
            id="ticket_price"
            name="ticket_price"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.ticket_price}
            className="w-full text-gray-500 border-softPink focus:ring-accent"
          />
          {formik.errors.ticket_price && <p className="text-red-500 mt-2 text-sm">{formik.errors.ticket_price}</p>}
        </div>

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

      <Button
        type="submit"
        className="w-full bg-accent text-base hover:bg-softPink"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Submit
  </Button>
      </form>
    </div>
  );
};