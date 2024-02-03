// Import Link from Next.js
'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

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

    // Assuming a similar structure for recipes
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/all');
          const data = await response.json();
          setRecipes(data);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      };
  
      fetchRecipes();
    }, []);

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3, // Adjust the number of slides to show
      slidesToScroll: 1,
    };

  return (
    <div className="flex flex-col items-center p-8 overflow-x-scroll">
      <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
      <div className="flex space-x-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="flex flex-col items-center cursor-pointer">
            {/* Use Link component for the entire blog post card */}
            <Link href={`/blog/${blog.id}`}>
              <div>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  className="object-cover"
                  layout="responsive"
                  height="200"
                  width="200"
                />
                <h3 className="text-lg font-semibold">{blog.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
       {/* Latest Recipes */}
       <h2 className="text-2xl font-bold my-4">Latest Recipes</h2>
      <div className="flex space-x-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex flex-col items-center cursor-pointer">
            <Link href={`/recipe/${recipe.id}`}>
              <div>
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  className="object-cover"
                  layout="fixed"
                  height="50"
                  width="0"
                />
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    
    </div>

    
  );
};

export default BlogList;
