import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, updateUser } from '../services/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        navigate('/users');
        return;
      }
      
      try {
        setIsLoading(true);
        
        let page = 1;
        let userFound = null;
        
        while (page <= 2) { 
          const response = await getUsers(page);
          const user = response.data.find((u) => u.id === parseInt(id));
          if (user) {
            userFound = user;
            break;
          }
          page++;
        }

        if (userFound) {
          setFormData({
            first_name: userFound.first_name,
            last_name: userFound.last_name,
            email: userFound.email,
          });
        } else {
          toast.error('User not found');
          navigate('/users');
        }
      } catch (error) {
        toast.error('Failed to fetch user');
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      await updateUser(parseInt(id), {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      });
      toast.success('User updated successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex items-center space-x-3">
              <button
                onClick={() => navigate('/users')}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">Edit User</h1>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="pl-10 input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="pl-10 input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default EditUser;
=======
export default EditUser;
>>>>>>> cd0f53c09d9a9eec19f9c615d8b31325f50f4144
