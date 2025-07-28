'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Lock, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import secureFetch from '@/utils/securefetch'; // Make sure this path is correct
import { decrypt } from '@/utils/crypto';

const DUMMY_CREDENTIALS = {
  cardNumber: '4532 1234 5678 9012',
  expiryDate: '12/27',
  cvv: '123',
};

export default function PaymentGateway() {
  let { id } = useParams();
  id = decrypt(id)
  id = Number(id)
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
const router = useRouter();
  useEffect(() => {
    const getPaymentData = async () => {
      try {
        const response = await secureFetch('/payment-data', { id }, 'POST');
        // ('asdasdadad',response)
        if (response.code == 1) {
       setPaymentData(response.data[0]);
        } else {
          toast.error('can not find data')
        }
      } catch {
        toast.error('Payment data fetch failed');
      }
    };
    getPaymentData();
  }, [id]);
('psymentdaaa',paymentData);

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .required('Card number is required')
      .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Format: 1234 5678 9012 3456'),
    expiryDate: Yup.string()
      .required('Expiry date is required')
      .matches(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
    cvv: Yup.string()
      .required('CVV is required')
      .matches(/^\d{3}$/, 'Must be 3 digits'),
  });

  const formik = useFormik({
    initialValues: { cardNumber: '', expiryDate: '', cvv: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const isValid =
        values.cardNumber === DUMMY_CREDENTIALS.cardNumber &&
        values.expiryDate === DUMMY_CREDENTIALS.expiryDate &&
        values.cvv === DUMMY_CREDENTIALS.cvv;

      if (!isValid) {
        toast('Invalid Card details!');
        setIsLoading(false);
        return;
      }
        const res1 = await secureFetch('/payment',{id},'POST')
        ('payment res',res1)
        if (res1.code == 1){
      await new Promise((res) => setTimeout(res, 2000));
   router.push('/user/payment/success')
      toast.success('Payment Successful!');
    }else{
      router.push('/user/payment/failed')
      toast.error(res1.message.keyword)
    }
      setIsLoading(false);
    },
  });

  const formatCardNumber = (val) =>
    val.replace(/\s+/g, '').replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();

  const formatExpiryDate = (val) => {
    const v = val.replace(/\D/g, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left Side: Warning and Credentials */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-700">
                This is a dummy payment gateway. Use only the test card credentials below. No real transactions will take place.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <div className="flex items-start mb-2">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Test Credentials</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Card:</strong> {DUMMY_CREDENTIALS.cardNumber}</li>
              <li><strong>Expiry:</strong> {DUMMY_CREDENTIALS.expiryDate}</li>
              <li><strong>CVV:</strong> {DUMMY_CREDENTIALS.cvv}</li>
            </ul>
          </div>

          {paymentData && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
              <p className="text-sm text-gray-700">Username: {paymentData.username}</p>
              <p className="text-sm text-gray-700">Event: {paymentData.event_title}</p>
              <p className="text-sm text-gray-700 capitalize">Order Type: {paymentData.order_type}</p>
              <p className="text-base font-semibold mt-2 text-green-600">₹{paymentData.total_amount}</p>
            </div>
          )}
        </div>

        {/* Right Side: Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Enter Card Details
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="19"
                  value={formik.values.cardNumber}
                  onChange={(e) => formik.setFieldValue('cardNumber', formatCardNumber(e.target.value))}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                />
                {formik.touched.cardNumber && formik.errors.cardNumber && (
                  <p className="text-red-500 text-sm">{formik.errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    name="expiryDate"
                    maxLength="5"
                    value={formik.values.expiryDate}
                    onChange={(e) => formik.setFieldValue('expiryDate', formatExpiryDate(e.target.value))}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="MM/YY"
                  />
                  {formik.touched.expiryDate && formik.errors.expiryDate && (
                    <p className="text-red-500 text-sm">{formik.errors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    maxLength="3"
                    value={formik.values.cvv}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="123"
                  />
                  {formik.touched.cvv && formik.errors.cvv && (
                    <p className="text-red-500 text-sm">{formik.errors.cvv}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{paymentData?.total_amount || '---'}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
