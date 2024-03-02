import { useState } from 'react';
import { CustomButton } from "@/index";
import { UpdateRecipeDataType } from '@/Types';


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
const IngredientInput: React.FC<{ updateRecipeData: UpdateRecipeDataType; recipedetails:ApiRecipeResponse|null }> = ({updateRecipeData}, recipedetails) =>{
    
    type Ingredient = {
        amount: number|string;
        unit: string;
        ingredient: string;
    };
    // state initialization with default values
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipedetails.ingredients);

    // adding a new ingredient to the ingredients array
    //create a new array with the existing ingredients and adds a new ingredient object
    const addIngredient = () => {
        setIngredients([...ingredients, { ingredient: '', amount: '', unit: 'gm' }]);
    };

    

    const handleChange = (index:number, field:string, value:string) => {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index][field as keyof typeof updatedIngredients[0]] = value;
      setIngredients(updatedIngredients);
      updateRecipeData('ingredients', updatedIngredients);
    };

    // handling the deletion of an ingredient
    const deleteIngredient = (index: number) => {
      const updatedIngredients = [...ingredients];
      updatedIngredients.splice(index, 1);
      setIngredients(updatedIngredients);
      updateRecipeData('ingredients', updatedIngredients);
    };

    return (
        <div>
          {ingredients && ingredients.map((ingredient, index) => (
            <div key={index} className="mb-4 list-decimal"> {/* Replaced flex with list-disc */}
              <li className="flex items-center gap-4"> {/* Added list item and flex for alignment */}
                <input
                  type="text"
                  value={ingredient.ingredient}
                  onChange={(e) => handleChange(index, 'ingredient', e.target.value)}
                  className="border p-2 bg-gray-200 text-lg font-medium rounded"
                  placeholder='Ingredient Name'
                />
    
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => handleChange(index, 'amount', e.target.value)}
                  className="border p-2 bg-gray-200 rounded"
                  placeholder='Amount'
                />
    
                <select
                  value={ingredient.unit}
                  onChange={(e) => handleChange(index, 'unit', e.target.value)}
                  className="border bg-gray-200 h-10 rounded"
                >
                  <option value="gm">gm</option>
                  <option value="kg">kg</option>
                  <option value="cup">cup</option>
                  <option value="tea-spoon">tea-spoon</option>
                  <option value="table-spoon">table-spoon</option>
                  <option value="pieces">pieces</option>
                </select>
                
                {/* Replace the standard button with CustomButton */}
                <CustomButton
                  type="button"
                  title="Delete"
                  varient="btn_dark_red"
                  otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                  onClick={() => deleteIngredient(index)}
                  // Add any other props as needed
                />
              </li>
            </div>
          ))}
          <div className="flex justify-center">
            <CustomButton
              type="button"
              title="Add Ingredient"
              onClick={addIngredient}
              otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
            />
          </div>
            
        </div>
      );
    };
    
    export default IngredientInput;
