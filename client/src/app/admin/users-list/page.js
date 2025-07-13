'use client';

import { useEffect, useState } from 'react';
import secureFetch from '@/utils/securefetch';
import { Button } from '@/components/ui/button';
import { UserX2, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchUsers = async () => {
    try {
      const res = await secureFetch('/userlist', {}, 'GET',true);
      if (res.code == 1 && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const handleBlock = async (id) => {
  try {
    const response = await secureFetch('/block-user', { id }, 'POST',true);
    if (response.code == 1) {
   
      toast.success('User blocked successfully!');
    } else {
      toast.error(response.message?.keyword || 'Failed to block user.');
    }
  } catch (err) {
    console.error('Block user error:', err);
    toast.error('Server error while blocking user.');
  }
};

const handleDelete = async (id) => {
  try {
    const response = await secureFetch('/delete-user', { id }, 'POST',true);
    if (response.code == 1) {
       
      toast.success('User deleted successfully!');
    } else {
      toast.error(response.message?.keyword || 'Failed to delete user.');
    }
  } catch (err) {
    console.error('Delete user error:', err);
    toast.error('Server error while deleting user.');
  }
};

  return (
    <div className="min-h-screen bg-base p-6">
      <h1 className="text-4xl font-bold underline text-deepNavy mb-6">User List</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow border border-base/20 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-deepNavy mb-2">{user.username}</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-accent">Events:</span>{' '}
                  {user.event_titles || 'No approved events'}
                </p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleBlock(user.id)}
                
                >
                  <ShieldOff className="w-4 h-4" /> Block
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleDelete(user.id)}
                 
                >
                  <UserX2 className="w-4 h-4 text-red-500" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListPage;
