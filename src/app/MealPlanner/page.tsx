'use client';
import { CustomButton } from '@/index';
import React from 'react'
import Calculator from './calorieCalculator';

const page = () => {
    const [calorie, setCalorie] = React.useState(0);
    const [showCalculator, setCalculator] = React.useState(false);

    return (
        <div>
            <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
                <img
                    className="object-cover w-full h-full"
                    src="mealPlanBg.jpg"
                    alt="background"

                />
            </div>
            
            <div className="flex items-center h-full z-2">
                <div className="mt-6 ml-52">
                    <h1 className="text-5xl font-bold text-black">Put your diet on autopilot</h1>
                    <p className="text-xl mt-2 text-black">Create personalized meal plans based on your food preferences.</p>
                    <p className="text-xl text-black">Reach your diet and nutritional goals with our calorie calculator</p>
                    <p className="text-xl text-black font-bold"> Create your meal plan right here in seconds.</p>
                </div>
            </div>
            <div className="mt-10 ml-48 bg-slate-400 h-64 w-1/3 rounded-md flex">
                <input
                    name="Daily calorie intake"
                    type="number"
                    className="h-12 w-15 ml-36 mt-14 justify-center items-center text-center  bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block border-gray-300 rounded-md shadow-sm"
                    placeholder="Calorie Amount"
                    onChange={(e) => {
                        setCalorie(parseInt(e.target.value));
                    }}
                    min={0}
                />
                <CustomButton
                    type="button"
                    title="Not Sure?"
                    otherStyles="h-12 w-30 ml-4 mt-14 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setCalculator(true);
                    }}
                />
                
                {showCalculator && <Calculator 
                onClose={() => setCalculator(false)}
                onSetCalorie={()=>setCalorie(calorie)}
                />}

            </div>
        </div>
    );
};



export default page