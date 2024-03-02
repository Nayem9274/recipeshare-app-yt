"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import RecipeDisplay from "@/components/RecipeDetails";

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
    user: number; // Assuming user is a user ID
  }[];
}

const Recipe = () => {
  const [recipeData, setRecipeData] = useState<ApiRecipeResponse | null>(null);
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
    console.log("Adding comment:", newComment);
    // Clear the comment input
    //setNewComment('');//////must add
  };

  // Function to transform numerical ratings to stars
  // StarRating component
  const StarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<span key="half">½</span>);
    }

    return <div className="flex">{stars}</div>;
  };
  return (
    <div className="bg-container">
      <div
        className="bg-image"
        style={{ backgroundImage: `url("/recipe_bg.jpg")` }}
      ></div>
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
          <h1 className="text-3xl font-bold uppercase xl:text-5xl mt-1 mb-1 ml-4">
            {recipeData.title}
          </h1>
        </div>
        {/* USER INFO */}

        <div className="bg-lime-200 hover:bg-lime-400  mt-4 rounded-md">
          <p className="ml-4 text-xl">By {recipeData.user.name}</p>
          <p className="ml-4 text-lg">
            Cooking Time {recipeData.cooking_time} minutes
          </p>
        </div>

        {/* TAGS */}
        <div className="bg-lime-200 hover:bg-lime-400 mt-4 rounded-md">
          <p className="text-lg text-indigo-500 font-bold mb-2 ml-4">Tags:</p>
          <p className="text-lg text-red-500 ml-4">
            {recipeData.tags.join(", ")}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 p-4 rounded-md bg-lime-200 hover:bg-lime-400">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="font-serif text-lg italic">{recipeData.description}</p>
        </div>

        {/* INGREDIENTS */}
        <div className="bg-lime-200 hover:bg-lime-400 mt-8 rounded-md">
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

        <div className="text-[100px] text-center text-white">Instructions</div>

        <RecipeDisplay
          instructions={recipeData.steps.map((step) => step.step)}
          image="https://firebasestorage.googleapis.com/v0/b/recipeshare-a2186.appspot.com/o/images%2Fpexels-dhiraj-jain-12737656.jpg?alt=media&token=2a0e445d-ac7a-47fa-9f79-a870326f0a83"
        />

        {/* ADD COMMENT FORM */}
        <div className="bg-lime-200 hover:bg-lime-400  mt-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4 ml-4">Add a Comment</h2>
        </div>
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Type your comment here..."
            value={newComment}
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
