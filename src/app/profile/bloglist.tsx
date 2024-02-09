// BlogList.tsx
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  publication_date: string;
  image: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

const BlogList: React.FC<{ onClose: () => void ; userName: string}> = ({ onClose, userName }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  
  

  useEffect(() => {

    
    const fetchBlogs = async () => {
    
           try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/get/all');
            const data = await response.json();
            const userBlogs = data.filter((blog: Blog) => blog.user.name === userName);
            setBlogs(userBlogs);
            if (response.ok) {
              const data = await response.json();
            
            } else {
              console.error('Error fetching user details:', response.status);
            }
          } catch (error) {
            console.error('Error fetching blogs:', error);
          }
      
    
    };

    
    fetchBlogs();
  },[userName] );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Blogs</h2>
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-4">
           
            <Link href={`/blog/${blog.id}`}>
              
                <h3 className="text-lg font-semibold cursor-pointer">{blog.title}</h3>
              
            </Link>
            <p className="text-sm text-gray-500">{`Published on ${new Date(
              blog.publication_date
            ).toLocaleDateString()}`}</p>
             <Link href={`/blog/${blog.id}`}>
              <div style={{ width: '350px', height: '350px'}}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  className="object-cover cursor-pointer"
                  layout="responsive"
                  height={100}
                  width={100}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
