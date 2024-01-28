// Import necessary modules from Next.js and React
'use client'
import Link from 'next/link'; // Import Link from Next.js for navigation
import { userDetails } from "@/data";
import BlogList from './bloglist';
import React, { useState, useEffect } from 'react';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  image: string | null;
  date_joined: string;
  last_login: string;
}

// Create the ProfilePage component
const ProfilePage = () => {

  const [cookie, setCookie] = React.useState<string|undefined>('');
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);

  useEffect(() => {
    const fetchCookie = () => { 
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt='))?.split('=')[1];
      
      setCookie(cookieValue);
    }
    
    const fetchUserDetails = async () => {
      const dataBody = {
        'jwt': {cookie}
      }
      console.log(dataBody);
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/details/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });
        const data = await response.json();
        setUserDetails(data.user_details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchCookie();
    fetchUserDetails();
  }, []);
  

  const [showBlogs, setShowBlogs] = useState(false);

  const handleOpenBlogs = () => {
    setShowBlogs(true);
  };

  const handleCloseBlogs = () => {
    setShowBlogs(false);
  };
  
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col items-center bg-blue-100">
      {userDetails && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full mb-8">
          <h1 className="text-3xl font-bold uppercase mb-4">Profile</h1>
          <div className="flex items-center mb-6">
            <div className="rounded-full overflow-hidden h-24 w-24 bg-gray-300">
              {userDetails.image ? (
                <img src={userDetails.image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-500 text-3xl flex items-center justify-center h-full w-full">
                  No Image
                </span>
              )}
            </div>
            <div className="ml-6">
              <p className="text-xl font-semibold">{userDetails.name}</p>
              <p className="text-gray-600">{userDetails.email}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-semibold">Date Joined:</span> {new Date(userDetails.date_joined).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Last Login:</span> {new Date(userDetails.last_login).toLocaleString()}
            </p>
          </div>
          {/* Notification bar */}
          <div className="bg-green-500 p-4 text-white rounded-md">
            <Link href="/">
              <span>View Notifications</span>
            </Link>
          </div>
          {/* View Blogs button */}
          <button onClick={handleOpenBlogs} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
            View Blogs
          </button>
        </div>
      )}
       {showBlogs && <BlogList onClose={handleCloseBlogs} />}
      {/* Second box with tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl w-full mb-8">
        <h2 className="text-xl font-bold mb-4">Tabs</h2>
        <div className="flex space-x-4">
          <Link href="/">
            <span className="text-red-500 hover:underline">Your Recipes</span>
          </Link>
          <Link href="/">
            <span className="text-red-500 hover:underline">Your Blogs</span>
          </Link>
          <Link href="/">
            <span className="text-red-500 hover:underline">Edit Profile</span>
          </Link>
          <Link href="/">
            <span className="text-red-500 hover:underline">Upload Recipes</span>
          </Link>
          <Link href="/UploadBlog">
            <span className="text-red-500 hover:underline">Upload Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export the ProfilePage component
export default ProfilePage;
