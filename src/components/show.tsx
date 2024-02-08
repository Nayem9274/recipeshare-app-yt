// Import Link from Next.js
'use client'
import Link from 'next/link';
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

interface Recipe {
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

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<string>('blogs'); // Default to 'blogs' tab

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

    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/all');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchBlogs();
    fetchRecipes();
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`text-lg font-semibold cursor-pointer focus:outline-none ${
            activeTab === 'blogs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={`text-lg font-semibold cursor-pointer focus:outline-none ${
            activeTab === 'recipes' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes
        </button>
      </div>

      {activeTab === 'blogs' && (
        <div className="flex flex-col items-center">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex flex-col items-center cursor-pointer mb-4">
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
                  <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="flex flex-col items-center">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-col items-center cursor-pointer mb-4">
              <Link href={`/recipe/${recipe.id}`}>
                <div style={{ width: '350px', height: '350px'}}>
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    className="object-cover cursor-pointer"
                  layout="responsive"
                  height={100}
                  width={100}
                  />
                  <h3 className="text-lg font-semibold mt-2">{recipe.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
