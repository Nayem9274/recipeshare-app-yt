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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/all');
        const data = await response.json();
        // Filter recipes based on user name
        const userRecipes = data.filter((recipe: Recipe) => recipe.user.name === userName);
        console.log(userName);
        //setRecipes(data);
     
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [userName]);

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
