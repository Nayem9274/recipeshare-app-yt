"use client";
import { Uploadfiles } from '@/Uploadfiles';
import React, { useState } from 'react'
import { updateState, updatePercentage, updateMsg, updateLink } from '@/Types';
import Overlay from './Overlay';
import { CustomButton } from '..';

const RecipeFromPhoto = () => {

    const [selectedImage, setSelectedImage] = useState<File|null>(null);
    const [percentage, setPercentage] = useState<number>(0);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('Uploading...');
    const [link, setLink] = useState<string>('');
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const updateState:updateState =(value:boolean)=>{
        setIsUploadingImage(value);
    }

    const updateMsg:updateMsg = (value:string)=>{
        setMsg(value);
    }

    const updatePercentage:updatePercentage =(value:number)=>{ 
        setPercentage(value); 
    }

    const updateLink:updateLink = (value:string)=>{
        setLink(value);
        setIsImageUploaded(true);
    }

    const handleFileUpload = () => {
        (document.querySelector('input[type="file"]')as HTMLInputElement).click();
    };
    const imageUpload = async (selectedImage:File) => {
        
        if(!selectedImage){
            alert('no file selected');
            return;
        }

        try {
            await Uploadfiles(selectedImage,updateState, updatePercentage, updateMsg, updateLink);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setPercentage(0); // Reset progress after upload completion or failure
        }
    }

    const handleGetRecipe = async () => {
        
        if(link === ''){
            alert('upload image first');
            return;
        }
        setIsLoading(true); // Start loading

        const dataBody = {
            'url': link
          }
          console.log(dataBody);

        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/photoinfo/',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataBody)
            });
            const data = await response.json();
            console.log(typeof data);
            console.log(data);
            setIsLoading(false); // Stop loading after response

            // Encode the recipes as a JSON string in the URL parameter
            const encodedRecipes = encodeURIComponent(JSON.stringify(data));
            const redirectUrl = `/view/recipe/fromPhoto?recipes=${encodedRecipes}`;
            window.location.href = redirectUrl;

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false); // Stop loading on error
        }        

    }

  return (
    <div>
      {isUploadingImage && <Overlay uploadProgress={percentage} msg={msg}/>}
        <div
            className="fixed top-0 left-0 w-full h-screen z-[-1]"
        >
            <img
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Background"
            />
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center flex-col bg-slate-300 h-1/3 w-1/2 rounded-xl">
            
            <div className="font-extrabold text-2xl mt-4">
                GET RECIPE FROM PHOTO
            </div> 
            
            <div className="font-extralight mt-4">
                Upload a photo of a recipe and we will find it for you!
            </div>

            {/* input image here */}
            <div className="mt-4 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 focus:outline-none cursor-pointer" onClick={handleFileUpload}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6H20M4 12H20M4 18H20M9 4L15 4M9 10L11 10M9 16L11 16" />
                </svg>
                    Upload a photo
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                          setSelectedImage(file);
                          imageUpload(file);
                          setIsImageUploaded(false);
                        }else{
                          alert('error in file selection');
                        }
                        
                      }} 
                />
            </div>

            { isImageUploaded && (
                  <div className="flex justify-center mt-6">
                    <img
                      src={link}
                      alt="uploaded image"
                      className="w-24 h-24 object-cover"
                    />
                  </div>
            )}

            <div className="absolute bottom-4 right-4">
                <CustomButton
                    type='button'
                    title='Get Recipe'
                    onClick={handleGetRecipe}
                    otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                />
            </div>

            {isLoading && (
                <div className="loading-overlay mt-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}


        </div>

        

    </div>
  )
}

export default RecipeFromPhoto