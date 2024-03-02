"use client";
import React, {useEffect, useState} from 'react';

import  TestForm  from './testForm';
import CustomButton  from '@/components/CustomButton';
import { useParams } from "next/navigation";


interface ApiRecipeResponse {
    id: number;
    title: string;
    description: string;
    calories: string;
    meal_type:string;
    servings: string;
    cooking_time: string;
    ingredients: {
      amount: number;
      unit: string;
      ingredient: string;
    }[];
    image: string; // Optional image field
    video: string; // Optional video field
    publication_date: string;
    last_modification_date: string;
    tags: string[];
    ratings: number;
    user: {
      name: string;
      id:number;
      // Add other user-related fields based on your User model
    };
    steps: {
      // Assuming image is an array of strings based on your JSON structure
      order: number;
      step: string;
      image: string;
    }[];
    
    
  }

const UploadRecipe = () => {
  // for sending the data to the backend
  const [recipeData, setRecipeData] = React.useState<Record<string, any>>({
    id:Number,
    title: "",
    cooking_time:Number,
    difficulty_level:"easy",
    description: "",
    image:"",
    video:"",
    meal_type:"breakfast",
    ingredients: [],
    steps: [],
    tags: [],
    jwt:"",
    servings: Number,
    user:""
  });

  const [recipeDetails, setRecipeDetails] = useState<ApiRecipeResponse | null>(null);
  const { id: recipeId } = useParams(); // Destructure the id property
  
  type UpdateRecipeDataType = (key: string, value: any) => void;
  

  // for storing the cookie
  const [cookie, setCookie] = React.useState<string|undefined>('');
  const [imageSrc, setImageSrc] = React.useState<string>("https://firebasestorage.googleapis.com/v0/b/recipeshare-410617.appspot.com/o/image.jpeg?alt=media&token=d7dd590a-5cab-44ec-ba37-9cfd37820074");
  
  const updateRecipeData:UpdateRecipeDataType = (key: string, value: any) => {
    setRecipeData({ ...recipeData, [key]: value });
    console.log(recipeData);
  };

  /************Cookie Part***********/
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

  const fetchRecipeDetails = async () => {
    if(cookie != ''){
      const dataBody = {
        'recipe_id': recipeId,
        'jwt': cookie
      }
      console.log(dataBody)
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });
        const data: ApiRecipeResponse = await response.json();
        setRecipeDetails(data);
      } catch (error) {
        console.error('Error fetching recipe details', error);
      }
    }
  };

  const updateRecipeDetails = () => {
    // from recipe details update recipedata
    updateRecipeData('id', recipeDetails?.id);
    updateRecipeData('title', recipeDetails?.title);
    updateRecipeData('description', recipeDetails?.description);
    updateRecipeData('meal_type', recipeDetails?.meal_type);
    updateRecipeData('servings', recipeDetails?.servings);
    updateRecipeData('cooking_time', recipeDetails?.cooking_time);
    updateRecipeData('ingredients', recipeDetails?.ingredients);
    updateRecipeData('image', recipeDetails?.image);
    updateRecipeData('video', recipeDetails?.video);
    updateRecipeData('tags', recipeDetails?.tags);
    updateRecipeData('steps', recipeDetails?.steps);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCookie();
      updateRecipeData('jwt', cookie);
      fetchRecipeDetails();
      updateRecipeDetails();
      console.log(recipeData);
    };

    fetchData();
  }, [cookie]);

  
  // activated when publish button clicked
  const handlePublish = async () => {
    console.log(recipeData);

    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }
  
    
    /************Add the cookie to the body ************** */
    updateRecipeData('jwt', cookie);

    try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/add/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData)
        });

        const data = await response.json();
        console.log('Response Data:', data);
      
      // alert if response is unsuccessful
      if(data.status == 401){
        alert('Upload Unsuccessful');
      }
      else if(data.error){
        alert('Upload Unsuccessful');
      }
      else{
        alert('Upload Successful');
        window.location.href = '/profile';
        console.log(data)
      }
    }catch (error) {
      console.log('error: ', error);
    }
  }


  return (
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/mealPlanBg.jpg")`}}></div>
      
      {/* New div for the photo */}
      <div className="flex flex-col items-center py-1">
        <img
          id="recipe_photo"
          src={imageSrc}
          alt="Recipe Photo"
          className="w-24 h-24 object-cover"
          style={{maxHeight: '500px', maxWidth: '500px'}}
        />
      </div>
      <div className="flex justify-center py-2">
        <h1 className="text-3xl font-bold">Upload Recipe</h1>
      </div>
      <div className='text-stone-700 font-bold flex justify-center'>
          Show others your finished dish
      </div>

      

      {/* New div for the form */}
      <div className="">
        <TestForm updateRecipeData={updateRecipeData} recipedetails={recipeDetails}/>
      </div>

      
      <div className="button py-10 flex justify-center">
          <CustomButton 
              type="button"
              title="Publish Your Recipe" 
              varient='btn_light_orange' 
              otherStyles='bg-orange-400 border-orange-500 px-4 py-2 rounded-full'
              onClick={handlePublish}
              />
        </div>
    </div>
  );
}

export default UploadRecipe;

