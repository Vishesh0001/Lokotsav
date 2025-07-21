'use client'
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import secureFetch from '@/utils/securefetch';
export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await secureFetch(`/orderdetails`,{},'GET');

        
           if(res.code==1){
      setPayments(res.data);
      toast.success('Payments fetched!')
           }
           else{
            toast.error('You have not made any payments')
           }
  
      } catch (error) {
        toast.error('something went wrong')
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Payments</h2>

      {loading ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" /> Loading...
        </div>
      ) : payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        payments.map((payment) => (
          <Card key={payment.payment_id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">
                {payment.order_type === 'featured' ? 'Featured Event' : 'Ticket Purchase'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Event:</strong> {payment.event_title}</p>
              <p className="flex items-center gap-1">
                <strong>Amount:</strong> <IndianRupee className="w-4 h-4" /> {payment.amount_paid}
              </p>
              <p><strong>Status:</strong> {payment.payment_status}</p>
              <p><strong>Time:</strong> {new Date(payment.payment_time).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
