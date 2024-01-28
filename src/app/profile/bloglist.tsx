// BlogList.tsx
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

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

const BlogList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/get/all');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md">
        <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Blogs</h2>
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-4">
            <Image
                        src={blog.image}
                        alt={blog.title}
                        className="object-cover"
                        layout="responsive"
                        height="200"
                        width="200"
                    />
          
            <h3 className="text-lg font-semibold">{blog.title}</h3>
            <p className="text-sm text-gray-500">{`Published by ${blog.user.name} on ${new Date(blog.publication_date).toLocaleDateString()}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
