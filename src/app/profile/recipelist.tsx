// RecipeList.tsx
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

const RecipeList: React.FC<{ onClose: () => void ; userName: string}> = ({ onClose, userName }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cookie, setCookie] = useState<string | undefined>('');

  useEffect(() => {
    const fetchCookie = () => {
      const cookieValue = document.cookie.split('; ')
        .find((row) => row.startsWith('jwt='))?.split('=')[1];

      // Use the setCookie callback to ensure that the state is updated before using it
      setCookie((prevCookie) => {
        if (prevCookie !== cookieValue) {
          return cookieValue;
        }
        return prevCookie;
      });
    };

    fetchCookie();
  }, []);

  useEffect(() => {
    const dataBody = {
      'jwt': cookie
    }
    console.log(dataBody)
    if (cookie) { // Check if JWT token is not empty
      const fetchRecipes = async () => {
        try {
          const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/get/all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              //'Authorization': `Bearer ${cookie}` // Include JWT token in the headers
            },
            body: JSON.stringify(dataBody)
          });
          if (response.ok) {
            const data = await response.json();
            setRecipes(data); // Set the blogs received from the backend
          } else {
            console.error('Error fetching recipes:', response.status);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      };
  
      fetchRecipes();
    }
  }, [cookie]); // Fetch blogs only when the JWT token changes and is not empty
  
  

  

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
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
              recipe.publication_date
            ).toLocaleDateString()}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
