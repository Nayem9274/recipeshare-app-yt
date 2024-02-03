"use client";
import React, {useEffect, useRef, useState,  } from 'react';

import { TestForm } from '@/index';
import CustomButton  from '@/components/CustomButton';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const UploadRecipe = () => {
   const router = useRouter();
  // for sending the data to the backend
  const [recipeData, setRecipeData] = React.useState<Record<string, any>>({
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
    username:""
  });
  type UpdateRecipeDataType = (key: string, value: any) => void;
  
  const usernameRef = useRef<string | undefined>('');
  
  // for storing the cookie
  const [cookie, setCookie] = React.useState<string|undefined>('');
  const [imageSrc, setImageSrc] = React.useState<string>("https://firebasestorage.googleapis.com/v0/b/recipeshare-410617.appspot.com/o/image.jpeg?alt=media&token=d7dd590a-5cab-44ec-ba37-9cfd37820074");
  
  const updateRecipeData:UpdateRecipeDataType = (key: string, value: any) => {
    setRecipeData({ ...recipeData, [key]: value });
    // console.log(recipeData);
  };

  /************Cookie Part***********/
  useEffect(() => {
  
    if (typeof window !== 'undefined') {
      // Get the username from the query parameter
      const searchParams = new URLSearchParams(window.location.search);
      const username = searchParams.get('username');
      if (username) {
       // console.log('Username:', username);
        usernameRef.current = username;
       
      } else {
        console.log('Username not found in query parameter.');
        // You can decide what to do if the username is not present.
        // For example, you may want to set a default username or show an error message.
      }
 
      // Do something with the username
     
    }
    
   // updateRecipeData('username', usernameRef.current);
    //console.log('Outside useEffect - recipeData.username:', recipeData.username);
    //console.log('Outside useEffect - recipeData.jwt:', recipeData.username);
    getCookie();
  }, []); // Optional dependency array
  
  const getCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];
    
    updateRecipeData('jwt', cookieValue);
   // updateRecipeData('username', usernameRef.current);
    setCookie(cookieValue);
  };
  
  // activated when publish button clicked
  const handlePublish = async () => {
    console.log(recipeData);

    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }
  
    
    /************Add the cookie to the body ************** */
    updateRecipeData('jwt', cookie);

    
    // Get the username from the query parameter
    //const username = router.query.username as string;
   

    // Add the username to the recipeData
    // Additional logging
  //console.log('Outside useEffect - usernameRef.current:', usernameRef.current);
  //console.log('Outside useEffect - recipeData.username:', recipeData.username);

    //updateRecipeData('username', usernameRef.current);

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
        console.log(data)
      }
    }catch (error) {
      console.log('error: ', error);
    }
  }


  return (
    <div className=" bg-gray-200 overflow-hidden">
      <div className="h-16 bg-stone-50 flex justify-between items-center border-b border-black px-4">
        <div className="text-left px-15 ">Your Logo</div>
        
        <div className="button ">
          <CustomButton 
              type="button"
              title="Publish" 
              varient='btn_light_orange' 
              otherStyles='bg-orange-400 border-orange-500 px-4 py-2 rounded-full'
              onClick={handlePublish}
              />
        </div>
      </div>

      {/* New div for the photo */}
      <div className="flex flex-col items-center py-10 ">
        <img
          id="recipe_photo"
          src={imageSrc}
          alt="Recipe Photo"
          className="w-24 h-24 object-cover"
          style={{maxHeight: '500px', maxWidth: '500px'}}
        />

        <div className='text-stone-700 font-bold py-2'>
            Show others your finished dish
        </div>
        {/* <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} /> */}
      </div>

      {/* New div for the form */}
      <div className="">
        <TestForm updateRecipeData={updateRecipeData}/>
      </div>

      <div className="py-10"></div>

    </div>
  );
}

export default UploadRecipe;

