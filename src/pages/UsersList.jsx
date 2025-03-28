import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit2, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Masonry from 'react-masonry-css';
import { getUsers, deleteUser } from '../services/api';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  // ✅ Function to fetch users and ensure uniqueness
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers(page);

      // Ensure uniqueness using Map
      const uniqueUsersMap = new Map();
      [...users, ...response.data].forEach(user => {
        uniqueUsersMap.set(user.id, user);
      });

      // Convert Map back to an array
      setUsers(Array.from(uniqueUsersMap.values()));

      setTotalPages(response.total_pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ✅ Handle Delete User
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-white">
   
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
            </div>


            <div className="flex-1 max-w-2xl mx-8">
              <h2 className="text-3xl font-medium text-gray-900 text-center">
                Hello ReqRes Users!
              </h2>
            </div>


            <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {users.map((user, index) => (
            <div key={`${user.id}-${index}`} className="mb-4">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <button onClick={() => navigate(`/users/${user.id}/edit`)} className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors duration-200">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors duration-200">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </Masonry>

        {/* ✅ Load More Button */}
        {!isLoading && page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
            >
              Load more
            </button>
          </div>
        )}

        {/* ✅ Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;