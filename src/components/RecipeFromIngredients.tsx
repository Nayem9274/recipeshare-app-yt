"use client";
import React, { useState } from 'react'
import { CustomButton } from '..';

const RecipeFromIngredients = () => {

    
    const [isLoading, setIsLoading] = useState(false);

    interface InputValue {
        value: string;
    }
      
    const [inputs, setInputs] = useState<InputValue[]>([]);
      
    const handleAddInput = () => {
        setInputs((prevInputs) => [...prevInputs, { value: '' }]);
    };
      
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        updatedInputs[index].value = event.target.value;
        return updatedInputs;
        });
    };
      
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const inputValues = inputs.map((input) => input.value);
    
        // Replace with your backend communication logic
        console.log('Sending data to backend:', inputValues);
    
        // Optionally, clear the input fields for a new entry
        setInputs([]);
    };

    const handleGetRecipe = async () => {
        setIsLoading(true); // Start loading

        // loop inputs and get only the string values
        const inputValues = inputs.map((input) => input.value);
        
        const dataBody = {
            'ingredients': inputValues,
            'number':'5'
          }
          console.log(dataBody);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/findrecipe/ingredients/',{ 
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

            // // Encode the recipes as a JSON string in the URL parameter
            const encodedRecipes = encodeURIComponent(JSON.stringify(data));
            const redirectUrl = `/view/recipe/fromIngredients?recipes=${encodedRecipes}`;
            window.location.href = redirectUrl;

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false); // Stop loading on error
        }        

    }

  return (
    <div>
        <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
            <img
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="background"

            />
        </div>
        
        <div className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center flex-col bg-slate-300 w-1/2 rounded-xl">
            
            <div className="font-extrabold text-2xl mt-4">
                GET RECIPE FROM INGREDIENTS
            </div> 
            
            <div className="font-extralight mt-4">
                Give us the list of ingredients and we will find recipe for you!
            </div>

            {/* // create a form to take the list of ingredients as input  */}
            <form className="flex flex-col items-center mt-6" onSubmit={handleSubmit}>
                {inputs.map((input, index) => (
                    <div key={index} className="mb-2 flex items-center">
                    <input
                        type="text"
                        name={`inputs[${index}]`}
                        value={input.value}
                        onChange={(event) => handleInputChange(index, event)}
                        className="bg-gray-100 px-3 py-2 rounded-md w-full mr-2"
                        placeholder="Enter ingredient name"
                    />
                    <button
                        type="button"
                        onClick={() => setInputs((prevInputs) => prevInputs.slice(0, index))}
                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                        Remove
                    </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddInput} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add more
                </button>

                <CustomButton
                    type='button'
                    title='submit'
                    onClick={handleGetRecipe}
                    otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                />
            </form>

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

export default RecipeFromIngredients