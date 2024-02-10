// RecipeList.tsx
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';

interface Recipe {
  id: number;
  title: string;
  description:string;
  last_edited: DateTime;
  image: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

const RecipeList: React.FC<{ onClose: () => void ; userName: string}> = ({ onClose, userName }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);  // Add this line
  const [cookie, setCookie] = React.useState<string | undefined>('');

  useEffect(() => {
    const fetchCookie = () => {
      if(cookie === '') {
        const cookieValue = document.cookie.split('; ')
                        .find((row) => row.startsWith('jwt='))?.split('=')[1];

        console.log(cookieValue);
        setCookie(cookieValue);
      }
    }
    
    const fetchRecipes = async () => {
      try {
        const dataBody = {
          'jwt': cookie
        }
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/get/all/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });
        const data = await response.json();
        
        console.log(data);
        // Filter recipes based on user name
        if(data.length === 0) { 
          setIsEmpty(true);
          console.log('Empty')
        }
     
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchCookie();
    fetchRecipes();
  }, [userName]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      
      {isEmpty && <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Recipes</h2>
        <p className="text-lg font-semibold cursor-pointer">No recipes found</p>
      </div>}
      
      <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Recipes</h2>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="mb-4">
            <Link href={`/recipe/${recipe.id}`}>
              
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  className="object-cover cursor-pointer"
                  layout="fixed"
                  height="200"
                  width="200"
                />
              
            </Link>
            <Link href={`/recipe/${recipe.id}`}>
              
                <h3 className="text-lg font-semibold cursor-pointer">{recipe.title}</h3>
              
            </Link>
            <p className="text-sm text-gray-500">{`Published on ${new Date(
              recipe.last_edited
            ).toLocaleDateString()}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
