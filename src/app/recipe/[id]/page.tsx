
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ApiRecipeResponse {
  id: number;
  title: string;
  description: string;
  cooking_time: string;
  ingredients: {
    amount: number;
    unit: string;
    ingredient: string;
  }[];
  image: string; // Optional image field
  publication_date: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
    // Add other user-related fields based on your User model
  };
  steps: {
    // Assuming image is an array of strings based on your JSON structure
    order: number;
    step: string;
    image: string;
  }[];
  comments: {
    id: number;
    text: string;
    date: string;
    user: number;  // Assuming user is a user ID
  }[];
}

const Recipe = () => {

  const [recipeData, setRecipeData] = useState<ApiRecipeResponse | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const markStepAsDone = (stepIndex: number) => {
    setCompletedSteps([...completedSteps, stepIndex]);
  };


  const { id: recipeId } = useParams(); // Destructure the id property
  console.log(recipeId); // Output: '12'
  //const router = useRouter();
  //const { recipeId } = router.query;


  useEffect(() => {

    const fetchData = async () => {

      console.log(recipeId);
      try {
        const response = await fetch(
          "https://recipeshare-tjm7.onrender.com/api/recipe/get/",
          {
            method: "POST",
            headers: {
              //Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcjEzNzM3NUBnbWFpbC5jb20iLCJleHAiOjE3MDYzMjY4MTMsImlhdCI6MTcwNjMyMzIxM30.xLX9HeailgdxCvDqcRsUGvctctH6rDnWpPpiDmTLbUs',
            },
            body: JSON.stringify({ recipe_id: recipeId?.toString() || "" }),
          }
        );
        const data: ApiRecipeResponse = await response.json();
        console.log(data);
        setRecipeData(data);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs once when the component mounts

  if (!recipeData) {
    return <div>Loading...</div>; // You might want to add a loading state
  }
  // State for managing the new comment
  // const [newComment, setNewComment] = useState('');//////must add
  const newComment = "";

  // Function to handle adding a new comment
  const handleAddComment = () => {
    // Implement your logic for adding a new comment here
    console.log('Adding comment:', newComment);
    // Clear the comment input
    //setNewComment('');//////must add
  };

  // Function to transform numerical ratings to stars
  // StarRating component
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const remainder = rating - fullStars;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="h-5 w-5 fill-current text-yellow-500"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.74 5.89 6.43.94-4.67 4.58 1.11 6.41-5.61-3.13-5.61 3.13 1.11-6.41L.83 7.83l6.43-.94L10 1z" />
        </svg>
      );
    }

    if (remainder >= 0.25) {
      stars.push(
        <svg
          key="partial"
          className="h-5 w-5 fill-current text-yellow-500"
          viewBox="0 0 20 20"
        >
          {/* Clip path to define the filled portion based on remainder */}
          <clipPath id="clip-path">
            <rect x="0" y="0" width={Math.floor(remainder * 100) + "%"} height="100%" fill="lightgray" />
          </clipPath>
          <path
            d="M10 1l2.74 5.89 6.43.94-4.67 4.58 1.11 6.41-5.61-3.13-5.61 3.13 1.11-6.41L.83 7.83l6.43-.94L10 1z"
            clipRule="evenodd"
            clipPath="url(#clip-path)"
          />
        </svg>
      );
    }

    return <div className="flex">{stars}</div>;
  };




  // const percentageComplete = Math.round((completedSteps.length / recipeData.steps.length) * 100);

  return (
    
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/recipe_bg.jpg")`}}></div>
      <div className="p-4 lg:px-20 xl:px-40">
        {/* IMAGE AND TITLE */}
        {recipeData.image && (
          <div className="relative w-full h-1/3 md:h-1/2 lg:w-1/2 bg-white rounded-t-md">
            <Image
              src={recipeData.image}
              alt=""
              className="object-cover"
              layout="responsive"
              height="100"
              width="100"
            />
          </div>
        )}
        <div className="bg-lime-200 hover:bg-lime-400 flex justify-between items-center mt-4 rounded-md">
          <h1 className="text-3xl font-bold uppercase xl:text-5xl mt-1 mb-1 ml-4">{recipeData.title}</h1>
        </div>
        {/* USER INFO */}

        <div className="bg-lime-200 hover:bg-lime-400  mt-4 rounded-md">
          <p className='ml-4 text-xl'>By {recipeData.user.name}</p>
          <p className='ml-4 text-lg'>Cooking Time {recipeData.cooking_time} minutes</p>
        </div>

        {/* TAGS */}
        <div className="bg-blue-200 hover:bg-lime-400 mt-4 rounded-md">
          <p className="text-lg text-indigo-500 font-bold mb-2 ml-4">Tags:</p>
          <p className="text-lg text-red-500 ml-4">
            {recipeData.tags.join(", ")}
          </p>
        </div>

        {/* Ratings Box */}
        <div className="bg-blue-200 hover:bg-lime-400 mt-4 rounded-md">
          <div className="flex items-center">
            <p className="text-lg text-indigo-500 font-bold mb-1 mx-3.5">Rating:</p>
            <StarRating rating={recipeData.ratings} />
            <span className="ml-2">
              {Math.round(recipeData.ratings * 4) / 4} {/* Round to the nearest 0.25 */}
            </span>
          </div>
          {/* Add a form to submit a rating */}
          <form onSubmit={addRating} className="flex-1 flex items-center">

            <input
              type="text"
              id="ratings"
              value={ratings}
              onChange={(e) => { setRatings(e.target.value); RatingsupData("ratings", e.target.value); }}
              className="w-half border rounded-md px-3 py-2 mt-1"
              style={{ padding: '10px' }}
              placeholder="Enter rating(1-5)..."
            />
            <button type="submit"><p className="text-lg text-red-700 font-bold mb-2">Submit</p></button>
          </form>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 p-4 rounded-md bg-blue-200 hover:bg-lime-400">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="font-serif text-lg italic">{recipeData.description}</p>
        </div>

        {/* INGREDIENTS */}
        <div className="bg-blue-200 hover:bg-lime-400 mt-8 rounded-md">
          <h2 className="text-2xl font-bold mb-2 mt-2 ml-4">Ingredients</h2>
          <ul className="list-disc pl-4 mb-2 mt-2 ml-4">
            {recipeData.ingredients.map((ingredientGroup, index) => (
              <li key={index}>
                {`${ingredientGroup.amount} ${ingredientGroup.unit} of ${ingredientGroup.ingredient}`}
              </li>
            ))}
          </ul>
        </div>

        {/* INSTRUCTIONS */}
  <div className="bg-lime-200 hover:bg-lime-400  mt-8 rounded-md">
    <h2 className="text-2xl font-bold mb-2 ml-4 mt-2">Instructions</h2>
    <ol className="list-decimal pl-4 ml-4 mt-2 mb-2">
      {recipeData.steps.map((step, index) => (
        <li key={index} className="mb-4">
          {/* Display the step text */}
          <span className="block">{`${step.step}`}</span>
          {/* Display the step image below the step text if present */}
          {step.image && (
            <div className="w-16 h-16 mx-6 mt-2">
              <Image
                src={step.image}
                alt={`Step ${index + 1}`}
                className="object-cover"
                layout="responsive"
                width={100}
                height={100}
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  </div>


        {/* ADD COMMENT FORM */}
        <div className="bg-lime-200 hover:bg-lime-400  mt-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4 ml-4">Add a Comment</h2>
        </div>
        <div className='mt-2'>
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Type your comment here..."
            value={text}
            onChange={(e) => { setText(e.target.value); CommentsupData("text", e.target.value); }}
          />
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
