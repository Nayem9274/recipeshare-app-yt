// Import necessary modules from Next.js and React
'use client'
import Link from 'next/link'; // Import Link from Next.js for navigation
import { userDetails } from "@/data";
import { useRouter } from 'next/navigation';
import BlogList from './bloglist';
import RecipeList from './recipelist';
import React, { useState, useEffect,useMemo } from 'react';
import CustomButton from '@/components/CustomButton';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  username?:string
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, username }) => (
  <Link href={{ pathname: href, query: { username } }}>
    <h3 className="text-white bg-green-500 hover:bg-red-600 py-2 px-4 rounded-md transition duration-300">{children} </h3>
  </Link>
);

interface UserDetail {
  id: number;
  name: string;
  email: string;
  image: string | null;
  date_joined: string;
  last_login: string;
  is_admin: boolean;
}

// Create the ProfilePage component
// Create the ProfilePage component
const ProfilePage = () => {

  const [cookie, setCookie] = React.useState<string | undefined>('');
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie.split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];

    setCookie(cookieValue);
  }, []); // Empty dependency array to run only once

  // const fetchCookie = () => {
  //   const cookieValue = document.cookie.split('; ')
  //                       .find((row) => row.startsWith('jwt='))?.split('=')[1];
  
  //   // Use the setCookie callback to ensure that the state is updated before using it
  //   setCookie((prevCookie) => {
  //     if (prevCookie !== cookieValue) {
  //       return cookieValue;
  //     }
  //     return prevCookie;
  //   });
  // };
  

  const fetchUserDetails = async () => {
      const dataBody = {
        'jwt': cookie
      }
      console.log(dataBody)
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

  useEffect(() => {
    // const fetchUserDetails = async () => {
    //   if(cookieValue){
    //     const dataBody = {
    //       'jwt': cookie
    //     }
    //     console.log(dataBody)
    //     try {
    //       const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/details/',{
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(dataBody)
    //       });
    //       const data = await response.json();
    //       setUserDetails(data.user_details);
    //     } catch (error) {
    //       console.error('Error fetching user details:', error);
    //     }
    //   }
    // };

    fetchUserDetails();
  }, [cookie]);
  



  const handleOpenBlogs = () => {
    setShowBlogs(true);
  };

  const handleCloseBlogs = () => {
    setShowBlogs(false);
  };

  const handleOpenRecipes = () => {
    setShowRecipes(true);
  };

  const handleCloseRecipes = () => {
    setShowRecipes(false);
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
          {/* Your Recipe's*/}
          <button onClick={handleOpenRecipes} className="bg-blue-500 text-white px-10 py-2 rounded-md mt-4 mr-4">
            Your Recipes
          </button>
          {/* View Blogs button */}
          <button onClick={handleOpenBlogs} className="bg-blue-500 text-white px-10 py-2 rounded-md mt-4">
            Your Blogs
          </button>
        </div>
      )}

      {showRecipes && <RecipeList onClose={handleCloseRecipes} userName={userDetails?.name || ''} />}
      {showBlogs && <BlogList onClose={handleCloseBlogs} userName={userDetails?.name || ''} />}

      {/* Second box with tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl w-full mb-8">
        <h2 className="text-xl font-bold mb-4">Tabs</h2>
        <div className="flex space-x-4">
          <ButtonLink href="/">Notifications</ButtonLink>
          <ButtonLink href="/">Edit Profile</ButtonLink>
          {userDetails ? (
            <ButtonLink href="/UploadRecipe" username={userDetails.name || ''}>
                Upload Recipes
            </ButtonLink>
                      ) : (
              <p>Loading...</p>
              )}
          <ButtonLink href="/UploadBlog">Upload Blog</ButtonLink>
        </div>
      </div>

      {userDetails && userDetails.is_admin &&
        <CustomButton
          title="Go to Admin Page"
          type= "button"
          otherStyles="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"  
          onClick={() => {
            window.location.href = '/admin';
          }}
          />
      }
    </div>
  );
};

// Export the ProfilePage component
export default ProfilePage;
