'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';
import { set } from 'firebase/database';

interface Recipe {
  id: number;
  title: string;
  last_edited: DateTime;
  image: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

const RecipeList: React.FC<{ onClose: () => void ; userName: string}> = ({ onClose, userName }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Initialize with an empty array
  const [cookie, setCookie] = useState<string | undefined>('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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


  const fetchRecipes =  async() => {
    if(cookie != ''){
      const dataBody = {
        'jwt': cookie
      }
      setIsLoading(true);
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/get/all/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Invalid response format: not an array');
          // Handle error appropriately
          return;
        }
        if (data.length === 0) {
          setIsEmpty(true);
        } else {
          setRecipes(data);
        }
        
        if(data.length === 0){
          setIsEmpty(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchCookie();
      console.log('cookie: '+ cookie);  
      await fetchRecipes();
      console.log(recipes.length);
    };

    fetchData();
  }, [cookie]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
     <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2" 
        onClick={() => {
          window.location.href ='/profile';
        }}
        >
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Recipes</h2>
        {isLoading && <h3 className="text-lg font-semibold cursor-pointer">Loading...</h3>}

      {recipes.length === 0 ? (<h3 className="text-lg font-semibold cursor-pointer">No recipes found</h3>
        ):(
          recipes.map((recipe) => (
          <div key={recipe.id} className="mb-4 px-56">
            <div>
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
            </div>
            <div>
              <Link href={`/recipe/${recipe.id}`}>
                <h3 className="text-lg font-semibold cursor-pointer">{recipe.title}</h3>
              </Link>
            </div>
            
            <div className="text-sm text-gray-500">{`Published on ${new Date(
              recipe.last_edited
              ).toLocaleDateString()}`}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default RecipeList;
